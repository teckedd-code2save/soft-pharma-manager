export const dynamic = 'force-dynamic';

import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BuildingIcon,
  FlaskConicalIcon,
  PackageIcon,
  TrendingDownIcon,
} from 'lucide-react';
import { fetchLowStockSnapshot } from '@/lib/alerts';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DEFAULT_LOW_STOCK_THRESHOLD } from '@/lib/alerts';

function formatThresholdSource(source: string) {
  switch (source) {
    case 'redis-medicine':
      return 'Medicine override';
    case 'redis-default':
      return 'Redis default';
    case 'env':
      return 'Environment fallback';
    default:
      return 'Built-in fallback';
  }
}

export default async function AlertsPage() {
  const snapshot = await fetchLowStockSnapshot();
  const alertsReady = snapshot.controlState === 'ready';

  return (
    <div className="min-h-full bg-gradient-to-b from-rose-50 via-white to-amber-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <Button variant="ghost" size="sm" asChild className="w-fit px-0 text-muted-foreground">
              <Link href="/">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to medicines
              </Link>
            </Button>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-rose-600 text-white hover:bg-rose-600">
                  Inventory alerts
                </Badge>
                <Badge variant="outline">
                  {snapshot.supplierAlerts} supplier breach{snapshot.supplierAlerts === 1 ? '' : 'es'}
                </Badge>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Low-stock watchlist
              </h1>
              <p className="max-w-2xl text-sm text-slate-600">
                Alerts are evaluated from supplier inventory totals per medicine. Redis now gates
                the feature, and the database supplies the stock.
              </p>
            </div>
          </div>

          <Card className="min-w-[280px] border-slate-200 bg-slate-950 text-white shadow-none">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-300">
                Active threshold
              </CardDescription>
              <CardTitle className="text-4xl font-semibold">
                {snapshot.defaultThreshold ?? '—'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-slate-300">
              <span>
                {snapshot.defaultThresholdSource
                  ? formatThresholdSource(snapshot.defaultThresholdSource)
                  : 'Awaiting Redis'}
              </span>
              <span>{snapshot.redisHealthy ? 'Redis live' : 'Alerts paused'}</span>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-rose-100 bg-white/90">
            <CardHeader className="pb-2">
              <CardDescription>Suppliers in alert</CardDescription>
              <CardTitle>{snapshot.supplierAlerts}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              {snapshot.medicinesInAlert} medicine{snapshot.medicinesInAlert === 1 ? '' : 's'} affected.
            </CardContent>
          </Card>

          <Card className="border-amber-100 bg-white/90">
            <CardHeader className="pb-2">
              <CardDescription>Total shortage</CardDescription>
              <CardTitle>{snapshot.totalShortage}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Units needed to bring every flagged medicine back to threshold.
            </CardContent>
          </Card>
        </div>

        {!alertsReady ? (
          <Card className="border-amber-200 bg-white/90">
            <CardHeader>
              <CardTitle>Alerts are waiting on Redis</CardTitle>
              <CardDescription>
                {snapshot.setupMessage}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>
                Set <span className="font-mono text-xs">REDIS_URL</span>, then create{' '}
                <span className="font-mono text-xs">{snapshot.defaultThresholdKey}</span> with a
                numeric value like <span className="font-mono text-xs">{DEFAULT_LOW_STOCK_THRESHOLD}</span>.
              </p>
              <p>
                Optional medicine override keys use{' '}
                <span className="font-mono text-xs">{snapshot.medicineThresholdKeyPrefix}{"<id>"}</span>.
              </p>
            </CardContent>
          </Card>
        ) : snapshot.alerts.length === 0 ? (
          <Card className="border-emerald-100 bg-white/90">
            <CardHeader>
              <CardTitle>No suppliers are below threshold</CardTitle>
              <CardDescription>
                The current Redis threshold is {snapshot.defaultThreshold}. Raise it if you want to
                force alerts during rehearsal.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-4">
            {snapshot.alerts.map((alert) => {
              const isCritical = alert.shortage >= Math.max(5, Math.floor(alert.threshold * 0.25));

              return (
                <Card
                  key={alert.supplierRecordId}
                  className={
                    isCritical
                      ? 'border-rose-200 bg-white/95 shadow-sm'
                      : 'border-amber-200 bg-white/95 shadow-sm'
                  }
                >
                  <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          className={
                            isCritical
                              ? 'bg-rose-600 text-white hover:bg-rose-600'
                              : 'bg-amber-500 text-white hover:bg-amber-500'
                          }
                        >
                          {isCritical ? 'Critical shortage' : 'Low stock'}
                        </Badge>
                        <Badge variant="outline">{formatThresholdSource(alert.thresholdSource)}</Badge>
                        <Badge variant="outline">{alert.wholesalerName}</Badge>
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-slate-900">
                          {alert.medicineName}
                        </CardTitle>
                        <CardDescription className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                          <span className="inline-flex items-center gap-1">
                            <BuildingIcon className="h-4 w-4" />
                            {alert.brandName}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <FlaskConicalIcon className="h-4 w-4" />
                            {alert.formulationName}
                          </span>
                          {alert.packSize ? (
                            <span className="inline-flex items-center gap-1">
                              <PackageIcon className="h-4 w-4" />
                              {alert.packSize}
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1">
                            <BuildingIcon className="h-4 w-4" />
                            Supplier: {alert.wholesalerName}
                          </span>
                        </CardDescription>
                      </div>
                    </div>

                    <Button asChild className="w-full md:w-auto">
                      <Link href={`/${alert.medicineId}`}>
                        Open medicine
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardHeader>

                  <CardContent className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          Supplier stock
                        </div>
                        <div className="mt-2 text-3xl font-semibold text-slate-900">
                          {alert.stockQuantity}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          Threshold
                        </div>
                        <div className="mt-2 text-3xl font-semibold text-slate-900">
                          {alert.threshold}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          Shortage
                        </div>
                        <div className="mt-2 inline-flex items-center gap-2 text-3xl font-semibold text-rose-600">
                          <TrendingDownIcon className="h-6 w-6" />
                          {alert.shortage}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-medium text-slate-900">Medicine context</h2>
                        <span className="text-xs text-slate-500">
                          {alert.supplierCount} supplier{alert.supplierCount === 1 ? '' : 's'}
                        </span>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                          <div className="text-sm font-medium text-slate-800">Flagged supplier</div>
                          <Badge variant={alert.stockQuantity === 0 ? 'destructive' : 'secondary'}>
                            {alert.wholesalerName}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                          <div className="text-sm font-medium text-slate-800">Medicine-wide stock</div>
                          <Badge variant="outline">
                            {alert.totalMedicineStock}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                          <div className="text-sm font-medium text-slate-800">Healthy medicines</div>
                          <Badge variant="outline">
                            {snapshot.healthyMedicines}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
