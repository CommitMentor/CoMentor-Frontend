'use client'

import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, parse, isValid } from 'date-fns'
import { ko } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'
import { Input } from '@/components/ui/input'

interface DateRangePickerProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange | undefined) => void
}

export default function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  // 입력 필드 상태 관리
  const [fromInputValue, setFromInputValue] = useState(
    dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
  )
  const [toInputValue, setToInputValue] = useState(
    dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
  )

  // 기간 단축 버튼
  const handleQuickSelect = (days: number) => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - days)
    onDateRangeChange({ from, to })
    setFromInputValue(format(from, 'yyyy-MM-dd'))
    setToInputValue(format(to, 'yyyy-MM-dd'))
  }

  // 날짜 입력 처리
  const handleFromInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromInputValue(e.target.value)
    const parsedDate = parse(e.target.value, 'yyyy-MM-dd', new Date())

    if (isValid(parsedDate)) {
      onDateRangeChange({
        from: parsedDate,
        to: dateRange.to,
      })
    }
  }

  const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToInputValue(e.target.value)
    const parsedDate = parse(e.target.value, 'yyyy-MM-dd', new Date())

    if (isValid(parsedDate)) {
      onDateRangeChange({
        from: dateRange.from,
        to: parsedDate,
      })
    }
  }

  // dateRange 변경 시 입력 필드 업데이트
  React.useEffect(() => {
    if (dateRange.from) {
      setFromInputValue(format(dateRange.from, 'yyyy-MM-dd'))
    }
    if (dateRange.to) {
      setToInputValue(format(dateRange.to, 'yyyy-MM-dd'))
    }
  }, [dateRange.from, dateRange.to])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => handleQuickSelect(7)}
          className={cn(
            'text-xs',
            dateRange.from &&
              Math.round(
                (new Date().getTime() - dateRange.from.getTime()) /
                  (1000 * 60 * 60 * 24),
              ) === 7
              ? 'bg-muted font-medium'
              : '',
          )}
        >
          1주일
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => handleQuickSelect(14)}
          className={cn(
            'text-xs',
            dateRange.from &&
              Math.round(
                (new Date().getTime() - dateRange.from.getTime()) /
                  (1000 * 60 * 60 * 24),
              ) === 14
              ? 'bg-muted font-medium'
              : '',
          )}
        >
          2주일
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => handleQuickSelect(30)}
          className={cn(
            'text-xs',
            dateRange.from &&
              Math.round(
                (new Date().getTime() - dateRange.from.getTime()) /
                  (1000 * 60 * 60 * 24),
              ) === 30
              ? 'bg-muted font-medium'
              : '',
          )}
        >
          1개월
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => handleQuickSelect(90)}
          className={cn(
            'text-xs',
            dateRange.from &&
              Math.round(
                (new Date().getTime() - dateRange.from.getTime()) /
                  (1000 * 60 * 60 * 24),
              ) === 90
              ? 'bg-muted font-medium'
              : '',
          )}
        >
          3개월
        </Button>
      </div>

      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !dateRange.from && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'PPP', { locale: ko })} -{' '}
                    {format(dateRange.to, 'PPP', { locale: ko })}
                  </>
                ) : (
                  format(dateRange.from, 'PPP', { locale: ko })
                )
              ) : (
                <span>날짜 범위 선택</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="border-b p-3">
              <div className="mb-2 text-sm font-medium">직접 입력</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-muted-foreground mb-1 text-xs">
                    시작 날짜
                  </div>
                  <Input
                    type="date"
                    value={fromInputValue}
                    onChange={handleFromInputChange}
                    className="h-8 text-xs"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div>
                  <div className="text-muted-foreground mb-1 text-xs">
                    종료 날짜
                  </div>
                  <Input
                    type="date"
                    value={toInputValue}
                    onChange={handleToInputChange}
                    className="h-8 text-xs"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              locale={ko}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
