"use client"

import * as React from "react"
import { orderService } from "@/services/orders-service"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addDays, format } from "date-fns"
import { tr } from 'date-fns/locale'
import { CalendarIcon, CheckIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Calendar } from "@/components/ui/calendar"

export function AgencyCharts() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  
  const [groupBy, setGroupBy] = React.useState("day")

  // Tüm seçenekleri içeren sabit dizi
  const OPTIONS = [
    { value: 'totalPrice', label: 'Toplam Fiyat' },
    { value: 'totalPageCount', label: 'Toplam Sayfa' },
    { value: 'totalCompletedOrder', label: 'Tamamlanan Sipariş' }
  ]

  const [selectedValues, setSelectedValues] = React.useState<string[]>(OPTIONS.map(option => option.value))

  const [visibleLines, setVisibleLines] = React.useState({
    totalPrice: true,
    totalPageCount: true,
    totalCompletedOrder: true
  })

  const { data: rawData, isLoading, error } = useQuery({
    queryKey: ["agencyCharts", date?.from, date?.to, groupBy],
    queryFn: async () => {
      if (!date?.from || !date?.to) return []
      const formattedStartDate = format(date.from, "dd.MM.yyyy")
      const formattedEndDate = format(date.to, "dd.MM.yyyy")
      
      try {
        const response = await orderService.getAgencyAnalytics(
          formattedStartDate,
          formattedEndDate,
          groupBy
        )
        const jsonData = await response;

        return jsonData.agencyAnalytics;t
      } catch (err: any) {
        if (err.message) {
          throw new Error(err.message)
        }
        throw new Error("Bir hata oluştu")
      }
    },
    enabled: !!date?.from && !!date?.to,
    retry: false
  })

  // Veriyi tarih sırasına göre sırala (eskiden yeniye)
  const sortedData = React.useMemo(() => {
    if (!rawData) return []
    return [...rawData].sort((a, b) => {
      const dateA = new Date(a.period.split('.').reverse().join('-'))
      const dateB = new Date(b.period.split('.').reverse().join('-'))
      return dateA.getTime() - dateB.getTime()
    })
  }, [rawData])

  const handleSelect = (value: string) => {
    setSelectedValues(current => {
      if (current.includes(value)) {
        return current.filter(v => v !== value)
      }
      return [...current, value]
    })
    
    setVisibleLines(prev => ({
      ...prev,
      [value]: !prev[value]
    }))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sipariş Analizi</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Chart */}
        <div className="min-h-[300px] sm:min-h-[400px]">
          {isLoading ? (
            <div className="flex h-[300px] sm:h-[400px] items-center justify-center">
              <div>Yükleniyor...</div>
            </div>
          ) : error ? (
            <div className="flex h-[300px] sm:h-[400px] items-center justify-center">
              <div>Firmanın siparişi bulunmamaktadır.</div>
            </div>
          ) : sortedData && sortedData.length > 0 ? (
            selectedValues.length === 0 ? (
              <div className="flex h-[300px] sm:h-[400px] items-center justify-center">
                <div>Gösterilecek bir veri seçilmedi</div>
              </div>
            ) : (
              <div className="h-[300px] sm:h-[400px] w-full">
                <ResponsiveContainer>
                  <LineChart data={sortedData} margin={{ right: 30, left: 10 }}>
                    <XAxis 
                      dataKey="period"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis width={80} />
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                    {visibleLines.totalPrice && (
                      <Line
                        type="monotone"
                        dataKey="totalPrice"
                        stroke="#8884d8"
                        name="Toplam Fiyat"
                        dot={{ r: 4 }}
                      />
                    )}
                    {visibleLines.totalPageCount && (
                      <Line
                        type="monotone"
                        dataKey="totalPageCount"
                        stroke="#82ca9d"
                        name="Toplam Sayfa"
                      />
                    )}
                    {visibleLines.totalCompletedOrder && (
                      <Line
                        type="monotone"
                        dataKey="totalCompletedOrder"
                        stroke="#ffc658"
                        name="Tamamlanan Sipariş"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )
          ) : (
            <div className="flex h-[300px] sm:h-[400px] items-center justify-center">
              <div>Veri bulunamadı</div>
            </div>
          )}
        </div>

        {/* Kontrol Paneli */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Tarih Seçimi */}
          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal min-h-[40px] whitespace-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="line-clamp-1">
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "dd MMMM yyyy", { locale: tr })} -{" "}
                          {format(date.to, "dd MMMM yyyy", { locale: tr })}
                        </>
                      ) : (
                        format(date.from, "dd MMMM yyyy", { locale: tr })
                      )
                    ) : (
                      "Tarih Seçin"
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0" 
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                  locale={tr}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Gösterilecek Veriler */}
          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between min-h-[40px]">
                  <span className="line-clamp-1">Gösterilecek veriler</span>
                  {selectedValues.length > 0 && (
                    <Badge variant="secondary" className="ml-2 flex-shrink-0">
                      {selectedValues.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[250px] p-2" 
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <div className="space-y-2">
                  {OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                      role="button"
                      onClick={() => handleSelect(option.value)}
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border",
                          selectedValues.includes(option.value)
                            ? "border-primary bg-primary"
                            : "border-input"
                        )}
                      >
                        {selectedValues.includes(option.value) && (
                          <CheckIcon className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Gruplama Seçimi */}
          <div className="w-full">
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger className="w-full min-h-[40px]">
                <SelectValue placeholder="Grupla" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Günlük</SelectItem>
                <SelectItem value="month">Aylık</SelectItem>
                <SelectItem value="year">Yıllık</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}