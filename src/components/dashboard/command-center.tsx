"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, DollarSign, TrendingUp, Wallet, PieChart as PieIcon } from "lucide-react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts'
import { formatCurrency } from "@/lib/utils"

interface DashboardMetrics {
    financial: {
        totalInventoryValue: number
        estimatedCommission: number
    }
    inventory: {
        total: number
        distribution: { name: string; value: number; fill: string }[]
    }
}

export function CommandCenter({ metrics }: { metrics: DashboardMetrics }) {
    const { financial, inventory } = metrics



    const hasInventory = inventory.total > 0

    return (
        <div className="space-y-6">

            {/* 1. FINANCIAL SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total Inventory Value */}
                <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Valor de Inventario
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {formatCurrency(financial.totalInventoryValue)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1 text-emerald-600" />
                            <span className="text-emerald-600 font-medium">Activo</span>
                            <span className="ml-1">en portafolio</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Estimated Commission */}
                <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Comisiones Estimadas (5%)
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">
                            {formatCurrency(financial.estimatedCommission)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Potencial aproximado
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 2. MARKETING & INVENTORY SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Marketing Widget (Tabs) - Takes up 2 columns */}
                <Card className="md:col-span-2 shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg">Tráfico y Adquisición</CardTitle>
                        <CardDescription>Rendimiento de campañas digitales y web</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center text-muted-foreground text-sm bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                        Próximamente: Integración con GA4 y Meta Ads
                    </CardContent>
                </Card>

                {/* Inventory Distribution (Donut) - Takes up 1 column */}
                <Card className="shadow-sm border-slate-200 flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg">Inventario</CardTitle>
                        <CardDescription>Distribución por tipo</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[250px]">
                        {hasInventory ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={inventory.distribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {inventory.distribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                <PieIcon className="w-10 h-10 opacity-20" />
                                <span className="text-sm">Sin propiedades registradas</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
