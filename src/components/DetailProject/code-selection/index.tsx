'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import DateRangePicker from './DateRangePicker'
import FileList from './FileList'
import CodeViewer from './CodeViewer'
import useCodeSelection from './useCodeSelection'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { DateRange } from 'react-day-picker'

interface CodeSelectionTabProps {
  projectId: string
  files?: string[]
  onSelectCodeSnippet: (snippet: string) => void
}

export default function CodeSelectionTab({
  projectId,
  files,
  onSelectCodeSnippet,
}: CodeSelectionTabProps) {
  const {
    dateRange,
    handleDateRangeChange,
    files: codeFiles,
    selectedFile,
    handleSelectFile,
    code,
    selectedCode,
    handleSelectCode,
    codeTextareaRef,
    loading,
    error,
    fetchCommitsAndFiles,
  } = useCodeSelection({ projectId })

  const [activeTab, setActiveTab] = useState<string>('calendar')

  useEffect(() => {
    if (selectedFile) {
      setActiveTab('code')
    }
  }, [selectedFile])

  const handleGenerateQuestions = () => {
    if (selectedCode) {
      onSelectCodeSnippet(selectedCode)
    }
  }

  // DateRange 타입으로 변환하는 헬퍼 함수
  const handleDateChange = (range: DateRange | undefined) => {
    if (range) {
      handleDateRangeChange({
        from: range.from,
        to: range.to || range.from,
      })
    }
  }

  return (
    <div className="space-y-6">
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertTitle className="font-medium text-blue-700">시작하기</AlertTitle>
        <AlertDescription className="text-blue-600">
          코드를 분석하여 CS 질문을 생성하려면 날짜 범위를 선택하고, 파일을
          선택한 다음 코드 영역을 선택해 주세요.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            1. 날짜 및 파일 선택
          </TabsTrigger>
          <TabsTrigger
            value="code"
            disabled={!selectedFile}
            className="flex items-center gap-2"
          >
            2. 코드 선택
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="border-b p-6">
                  <h3 className="mb-2 text-lg font-semibold">날짜 범위 선택</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    분석할 코드의 커밋 날짜 범위를 선택해주세요.
                  </p>
                  <DateRangePicker
                    dateRange={dateRange}
                    onDateRangeChange={handleDateChange}
                  />
                </div>
                <div className="bg-muted/20 flex justify-end border-t p-6">
                  <Button
                    onClick={fetchCommitsAndFiles}
                    disabled={loading}
                    className="relative"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    파일 가져오기
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold">파일 선택</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  분석할 코드가 포함된 파일을 선택해주세요.
                </p>
                {error ? (
                  <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                ) : loading ? (
                  <div className="flex justify-center p-10">
                    <Loader2 className="text-primary h-6 w-6 animate-spin" />
                  </div>
                ) : codeFiles.length === 0 ? (
                  <div className="bg-muted rounded-md border p-4 text-sm">
                    날짜 범위를 선택하고 파일을 가져와주세요.
                  </div>
                ) : (
                  <FileList
                    files={codeFiles}
                    selectedFile={selectedFile}
                    onSelectFile={handleSelectFile}
                    loading={loading}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="code" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">코드 선택</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    분석할 코드 영역을 드래그하여 선택해주세요.
                  </p>
                </div>
                <Button
                  onClick={handleGenerateQuestions}
                  disabled={!selectedCode}
                  className="bg-primary hover:bg-primary/90"
                >
                  CS 질문 생성하기
                </Button>
              </div>

              <div className="bg-muted/20 overflow-hidden rounded-md border">
                <CodeViewer
                  code={code}
                  selectedCode={selectedCode}
                  onSelectCode={handleSelectCode}
                  codeTextareaRef={codeTextareaRef}
                  className="min-h-[400px] md:min-h-[500px]"
                />
              </div>

              {selectedCode && (
                <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4">
                  <h4 className="mb-2 text-sm font-medium text-blue-700">
                    선택된 코드
                  </h4>
                  <p className="text-muted-foreground mb-2 text-xs">
                    선택한 코드로 CS 질문이 생성됩니다.
                  </p>
                  <pre className="max-h-[150px] overflow-auto rounded border bg-white p-3 text-xs">
                    {selectedCode.substring(0, 500)}
                    {selectedCode.length > 500 && '...'}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
