"use client"

import * as React from "react"
import { orderService } from "@/services/orders-service"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addDays, format } from "date-fns"
import { tr } from "date-fns/locale"
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar } from "@/components/ui/calendar"

export function AgencyCharts() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  const [groupBy, setGroupBy] = React.useState("day")

  // Options array
  const OPTIONS = [
    { value: "totalPrice", label: "Toplam Fiyat" },
    { value: "totalPageCount", label: "Toplam Sayfa" },
    { value: "totalCompletedOrder", label: "Tamamlanan Sipariş" },
  ]

  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    OPTIONS.map((option) => option.value)
  )

  const [visibleLines, setVisibleLines] = React.useState({
    totalPrice: true,
    totalPageCount: true,
    totalCompletedOrder: true,
  })

  const {
    data: rawData,
    isLoading,
    error,
  } = useQuery({
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

        return jsonData.agencyAnalytics;
      } catch (err: any) {
        console.error("Error fetching data:", err) // Debug log
        if (err.message) {
          throw new Error(err.message)
        }
        throw new Error("Bir hata oluştu")
      }
    },
    enabled: !!date?.from && !!date?.to,
    retry: false,
  })

  // Sort data by date (oldest to newest)
  const sortedData = React.useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) return []

    console.log("Processing data:", rawData) // Debug log

    return [...rawData].sort((a, b) => {
      // Parse dates from DD.MM.YYYY format
      const [dayA, monthA, yearA] = a.period.split(".")
      const [dayB, monthB, yearB] = b.period.split(".")

      const dateA = new Date(+yearA, +monthA - 1, +dayA)
      const dateB = new Date(+yearB, +monthB - 1, +dayB)

      return dateA.getTime() - dateB.getTime()
    })
  }, [rawData])

  // Debug log for visualization
  React.useEffect(() => {
    console.log("Sorted data for chart:", sortedData)
    console.log("Selected values:", selectedValues)
    console.log("Visible lines:", visibleLines)
  }, [sortedData, selectedValues, visibleLines])

  const handleSelect = (value: string) => {
    setSelectedValues((current) => {
      if (current.includes(value)) {
        return current.filter((v) => v !== value)
      }
      return [...current, value]
    })

    setVisibleLines((prev) => ({
      ...prev,
      [value]: !prev[value],
    }))
  }

  // Custom tooltip formatter to properly format values
  const formatTooltipValue = (value: number, name: string) => {
    if (name === "Toplam Fiyat") {
      return `${value.toLocaleString("tr-TR")} ₺`
    }
    return value.toLocaleString("tr-TR")
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
            <div className="flex h-[300px] items-center justify-center sm:h-[400px]">
              <div>Yükleniyor...</div>
            </div>
          ) : error ? (
            <div className="flex h-[300px] items-center justify-center sm:h-[400px]">
              <div>Firmanın siparişi bulunmamaktadır.</div>
            </div>
          ) : sortedData && sortedData.length > 0 ? (
            selectedValues.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center sm:h-[400px]">
                <div>Gösterilecek bir veri seçilmedi</div>
              </div>
            ) : (
              <div className="h-[300px] w-full sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sortedData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
                  >
                    <XAxis
                      dataKey="period"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="#8884d8"
                      width={80}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                      width={80}
                    />
                    <Tooltip
                      formatter={formatTooltipValue}
                      labelFormatter={(label) => `Tarih: ${label}`}
                    />
                    <Legend verticalAlign="top" height={36} />

                    {visibleLines.totalPrice && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="totalPrice"
                        stroke="#8884d8"
                        strokeWidth={2}
                        name="Toplam Fiyat"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {visibleLines.totalPageCount && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="totalPageCount"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        name="Toplam Sayfa"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {visibleLines.totalCompletedOrder && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="totalCompletedOrder"
                        stroke="#ffc658"
                        strokeWidth={2}
                        name="Tamamlanan Sipariş"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )
          ) : (
            <div className="flex h-[300px] items-center justify-center sm:h-[400px]">
              <div>Veri bulunamadı</div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Date Selection */}
          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="min-h-[40px] w-full justify-start whitespace-normal text-left font-normal"
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

          {/* Data Selection */}
          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="min-h-[40px] w-full justify-between"
                >
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

          {/* Grouping Selection */}
          <div className="w-full">
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger className="min-h-[40px] w-full">
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
