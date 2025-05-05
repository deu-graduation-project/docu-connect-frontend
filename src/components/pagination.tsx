import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const maxPagesToShow = 5

    // If we have 5 or fewer pages, show all of them
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Always include first and last page
    const pageNumbers = [1]

    // Calculate the range of pages to show around the current page
    let startPage = Math.max(2, currentPage - 1)
    let endPage = Math.min(totalPages - 1, currentPage + 1)

    // Adjust if we're near the start
    if (currentPage <= 3) {
      endPage = Math.min(maxPagesToShow - 1, totalPages - 1)
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - maxPagesToShow + 2)
    }

    // Add ellipsis before the range if needed
    if (startPage > 2) {
      pageNumbers.push(-1) // -1 represents ellipsis
    }

    // Add the range of pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis after the range if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push(-2) // -2 represents ellipsis (using different value to avoid React key issues)
    }

    // Add the last page if it's not already included
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {/* Previous page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) => {
        // If page is -1 or -2, render ellipsis
        if (page < 0) {
          return (
            <Button
              key={`ellipsis-${index}`}
              variant="ghost"
              size="icon"
              disabled
              className="h-8 w-8"
            >
              <span>...</span>
            </Button>
          )
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
            className="h-8 w-8"
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        )
      })}

      {/* Next page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}
