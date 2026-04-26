import { prisma } from '@/lib/db/prisma';
import { getRedis } from '@/lib/redis';

export const DEFAULT_LOW_STOCK_THRESHOLD = 120;
const DEFAULT_THRESHOLD_KEY = 'alerts:threshold:default';
const MEDICINE_THRESHOLD_KEY_PREFIX = 'alerts:threshold:medicine:';

export type ThresholdSource =
  | 'redis-medicine'
  | 'redis-default'
  | 'env'
  | 'fallback';

export type AlertsControlState =
  | 'ready'
  | 'redis-not-configured'
  | 'redis-unreachable'
  | 'threshold-missing';

export interface LowStockAlert {
  supplierRecordId: number;
  medicineId: number;
  medicineName: string;
  brandName: string;
  formulationName: string;
  packSize?: string;
  wholesalerId: string;
  wholesalerName: string;
  stockQuantity: number;
  threshold: number;
  shortage: number;
  supplierCount: number;
  totalMedicineStock: number;
  thresholdSource: ThresholdSource;
}

export interface LowStockSnapshot {
  alerts: LowStockAlert[];
  totalMedicines: number;
  supplierAlerts: number;
  medicinesInAlert: number;
  healthyMedicines: number;
  totalShortage: number;
  defaultThreshold: number | null;
  defaultThresholdSource: Exclude<ThresholdSource, 'redis-medicine'> | null;
  redisConfigured: boolean;
  redisHealthy: boolean;
  defaultThresholdKey: string;
  medicineThresholdKeyPrefix: string;
  controlState: AlertsControlState;
  setupMessage: string;
}

function parseThreshold(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const threshold = Number.parseInt(value, 10);
  if (!Number.isFinite(threshold) || threshold < 0) {
    return null;
  }

  return threshold;
}

async function resolveDefaultThreshold() {
  const redis = getRedis();
  if (!redis) {
    return {
      defaultThreshold: null,
      defaultThresholdSource: null,
      redisConfigured: false,
      redisHealthy: false,
      redis: null,
      controlState: 'redis-not-configured' as const,
      setupMessage: 'Set REDIS_URL to enable Redis-controlled alerts.',
    };
  }

  try {
    const redisThreshold = parseThreshold(await redis.get(DEFAULT_THRESHOLD_KEY));
    if (redisThreshold !== null) {
      return {
        defaultThreshold: redisThreshold,
        defaultThresholdSource: 'redis-default' as const,
        redisConfigured: true,
        redisHealthy: true,
        redis,
        controlState: 'ready' as const,
        setupMessage: 'Redis threshold loaded.',
      };
    }

    return {
      defaultThreshold: null,
      defaultThresholdSource: null,
      redisConfigured: true,
      redisHealthy: true,
      redis,
      controlState: 'threshold-missing' as const,
      setupMessage: `Set ${DEFAULT_THRESHOLD_KEY} in Redis to activate alerts.`,
    };
  } catch (error) {
    console.error('Failed to read default alert threshold from Redis:', error);
    return {
      defaultThreshold: null,
      defaultThresholdSource: null,
      redisConfigured: true,
      redisHealthy: false,
      redis: null,
      controlState: 'redis-unreachable' as const,
      setupMessage: 'Redis is configured but unreachable. Alerts are paused.',
    };
  }
}

export async function fetchLowStockSnapshot(): Promise<LowStockSnapshot> {
  const medicines = await prisma.medicine.findMany({
    include: {
      brand: true,
      formulation: true,
      suppliers: {
        include: {
          wholesaler: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  const thresholdConfig = await resolveDefaultThreshold();
  if (thresholdConfig.controlState !== 'ready' || thresholdConfig.defaultThreshold === null) {
    return {
      alerts: [],
      totalMedicines: medicines.length,
      supplierAlerts: 0,
      medicinesInAlert: 0,
      healthyMedicines: medicines.length,
      totalShortage: 0,
      defaultThreshold: null,
      defaultThresholdSource: null,
      redisConfigured: thresholdConfig.redisConfigured,
      redisHealthy: thresholdConfig.redisHealthy,
      defaultThresholdKey: DEFAULT_THRESHOLD_KEY,
      medicineThresholdKeyPrefix: MEDICINE_THRESHOLD_KEY_PREFIX,
      controlState: thresholdConfig.controlState,
      setupMessage: thresholdConfig.setupMessage,
    };
  }

  const medicineKeys = medicines.map(
    (medicine) => `${MEDICINE_THRESHOLD_KEY_PREFIX}${medicine.id}`
  );

  let overrides: Array<string | null> = [];
  if (thresholdConfig.redis && medicineKeys.length > 0) {
    try {
      overrides = await thresholdConfig.redis.mget(...medicineKeys);
    } catch (error) {
      console.error('Failed to read medicine alert overrides from Redis:', error);
      overrides = [];
    }
  }

  const alerts = medicines
    .flatMap((medicine, index) => {
      const suppliers = medicine.suppliers
        .map((supplier) => ({
          id: supplier.id,
          wholesalerId: supplier.wholesaler_id,
          wholesalerName: supplier.wholesaler.name,
          stockQuantity: supplier.stock_quantity ?? 0,
        }))
        .sort((left, right) => left.stockQuantity - right.stockQuantity);

      const totalStock = suppliers.reduce(
        (sum, supplier) => sum + supplier.stockQuantity,
        0
      );

      const overrideThreshold = parseThreshold(overrides[index]);
      const threshold = overrideThreshold ?? thresholdConfig.defaultThreshold;
      const thresholdSource = overrideThreshold !== null
        ? 'redis-medicine'
        : thresholdConfig.defaultThresholdSource;

      return suppliers
        .filter((supplier) => supplier.stockQuantity <= threshold)
        .map((supplier) => ({
          supplierRecordId: supplier.id,
          medicineId: medicine.id,
          medicineName: medicine.brand_name || medicine.name,
          brandName: medicine.brand.name,
          formulationName: medicine.formulation.name,
          packSize: medicine.pack_size ?? undefined,
          wholesalerId: supplier.wholesalerId,
          wholesalerName: supplier.wholesalerName,
          stockQuantity: supplier.stockQuantity,
          threshold,
          shortage: Math.max(threshold - supplier.stockQuantity, 0),
          supplierCount: suppliers.length,
          totalMedicineStock: totalStock,
          thresholdSource,
        }) satisfies LowStockAlert);
    })
    .sort((left, right) => {
      if (right.shortage !== left.shortage) {
        return right.shortage - left.shortage;
      }

      return left.stockQuantity - right.stockQuantity;
    });

  const distinctMedicineIds = new Set(alerts.map((alert) => alert.medicineId));
  const totalShortage = alerts.reduce((sum, alert) => sum + alert.shortage, 0);

  return {
    alerts,
    totalMedicines: medicines.length,
    supplierAlerts: alerts.length,
    medicinesInAlert: distinctMedicineIds.size,
    healthyMedicines: medicines.length - distinctMedicineIds.size,
    totalShortage,
    defaultThreshold: thresholdConfig.defaultThreshold,
    defaultThresholdSource: thresholdConfig.defaultThresholdSource,
    redisConfigured: thresholdConfig.redisConfigured,
    redisHealthy: thresholdConfig.redisHealthy,
    defaultThresholdKey: DEFAULT_THRESHOLD_KEY,
    medicineThresholdKeyPrefix: MEDICINE_THRESHOLD_KEY_PREFIX,
    controlState: thresholdConfig.controlState,
    setupMessage: thresholdConfig.setupMessage,
  };
}
