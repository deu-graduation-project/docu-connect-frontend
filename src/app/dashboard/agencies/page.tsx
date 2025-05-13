"use client"
import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select"
import AgencyList from "../../../components/agency-list"
import { turkish_cities } from "@/lib/cities"

const paperTypeOptions = [
  { label: "A3", value: "A3" },
  { label: "A4", value: "A4" },
  { label: "A5", value: "A5" },
  { label: "A6", value: "A6" },
]

const colorOptionsList = [
  { label: "Siyah-Beyaz", value: "SiyahBeyaz" },
  { label: "Renkli", value: "Renkli" },
]

const printTypesList = [
  { label: "Tek Yüz", value: "TekYuz" },
  { label: "Çift Yüz", value: "CiftYuz" },
]

// Updated sorting options to match backend expectations
const sortingOptions = [
  { label: "Yıldıza göre azalan", value: "stardesc" },
  { label: "Yıldıza göre artan", value: "starasc" },
  { label: "Firma adına göre artan", value: "atoz" },
  { label: "Firma adına göre azalan", value: "ztoa" },
]

// Function to capitalize first letter of each word
const capitalizeWords = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1))
    .join(" ")
}

export default function Agencies() {
  // Filter states
  const [selectedCity, setSelectedCity] = useState<string | undefined>()
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>()
  const [selectedSorting, setSelectedSorting] = useState<string | undefined>()
  const [selectedPaperType, setSelectedPaperType] = useState<string | undefined>()
  const [selectedColorOption, setSelectedColorOption] = useState<string | undefined>()
  const [selectedPrintType, setSelectedPrintType] = useState<string | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Get available districts based on selected city
  const availableDistricts = useMemo(() => {
    if (!selectedCity) return []
    const city = turkish_cities.find((c) => c.name === selectedCity)
    return city ? city.counties : []
  }, [selectedCity])

  // Reset district when city changes
  const handleCityChange = (value: string) => {
    setSelectedCity(value)
    setSelectedDistrict(undefined)
    setCurrentPage(1) // Reset to first page when city changes
  }

  // Handle district change
  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
    setCurrentPage(1) // Reset to first page when district changes
  }

  // Handle sorting change
  const handleSortingChange = (value: string) => {
    setSelectedSorting(value)
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const handlePaperTypeChange = (value: string) => {
    setSelectedPaperType(value)
    setCurrentPage(1)
  }

  const handleColorOptionChange = (value: string) => {
    setSelectedColorOption(value)
    setCurrentPage(1)
  }

  const handlePrintTypeChange = (value: string) => {
    setSelectedPrintType(value)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSelectedCity(undefined)
    setSelectedDistrict(undefined)
    setSelectedSorting(undefined)
    setSelectedPaperType(undefined)
    setSelectedColorOption(undefined)
    setSelectedPrintType(undefined)
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col items-start p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold md:text-4xl">
          Explore the current agencies{" "}
        </h1>
        <p className="pt-1 text-base text-muted-foreground">
          Browse through a curated list of agencies to find the perfect match
          for your requirements.
        </p>
      </div>
      <div className="my-6 h-[1px] w-full max-w-7xl bg-secondary"></div>
      <div className="grid w-full max-w-7xl grid-cols-2 items-center justify-start gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {/* Cities select */}
        <Select
          key={selectedCity || "city"}
          value={selectedCity}
          onValueChange={handleCityChange}
        >
          <SelectTrigger className="w-full gap-2">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cities</SelectLabel>
              {turkish_cities.map((city) => (
                <SelectItem key={city.plate} value={city.name}>
                  {capitalizeWords(city.name)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Districts select - disabled if no city selected */}
        <Select
          key={selectedDistrict || "district"}
          value={selectedDistrict}
          onValueChange={handleDistrictChange}
          disabled={!selectedCity}
        >
          <SelectTrigger className="w-full gap-2">
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Districts</SelectLabel>
              {availableDistricts.map((district) => (
                <SelectItem key={district} value={district}>
                  {capitalizeWords(district)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Updated Sorting options */}
        <Select
          key={selectedSorting || "sort"}
          value={selectedSorting}
          onValueChange={handleSortingChange}
        >
          <SelectTrigger className="w-full gap-2">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by</SelectLabel>
              {sortingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Paper Type select */}
        <Select
          key={selectedPaperType || "paperType"}
          value={selectedPaperType}
          onValueChange={handlePaperTypeChange}
        >
          <SelectTrigger className="w-full gap-2">
            <SelectValue placeholder="Kağıt Türü" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Kağıt Türü</SelectLabel>
              {paperTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Color Options select */}
        <Select
          key={selectedColorOption || "colorOption"}
          value={selectedColorOption}
          onValueChange={handleColorOptionChange}
        >
          <SelectTrigger className="w-full gap-2">
            <SelectValue placeholder="Renk Seçeneği" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Renk Seçenekleri</SelectLabel>
              {colorOptionsList.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Print Type select */}
        <Select
          key={selectedPrintType || "printType"}
          value={selectedPrintType}
          onValueChange={handlePrintTypeChange}
        >
          <SelectTrigger className="w-full gap-2">
            <SelectValue placeholder="Baskı Tipi" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Baskı Tipleri</SelectLabel>
              {printTypesList.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button variant="default" onClick={resetFilters} className="col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1">
          Reset Filters
        </Button>
      </div>

      <div className="w-full max-w-7xl">
        <AgencyList
          province={selectedCity ? capitalizeWords(selectedCity) : undefined}
          district={
            selectedDistrict ? capitalizeWords(selectedDistrict) : undefined
          }
          orderBy={selectedSorting}
          paperType={selectedPaperType}
          colorOptions={selectedColorOption}
          printType={selectedPrintType}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
