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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
// ChevronsUpDown, Check, CommandEmpty, CommandGroup removed as they were unused
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

const ALL_OPTION_VALUE = "TUMU" // Using a constant for "All" option
const ALL_OPTION_LABEL = "Tümü"

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

  const orderByNumericValue = useMemo(() => {
    if (!selectedSorting) {
      return undefined
    }
    const index = sortingOptions.findIndex(
      (opt) => opt.value === selectedSorting
    )
    return index === -1 ? undefined : index
  }, [selectedSorting])

  // Reset district when city changes
  const handleCityChange = (value: string) => {
    if (value === ALL_OPTION_VALUE) {
      setSelectedCity(undefined)
      setSelectedDistrict(undefined)
    } else {
      setSelectedCity(value)
      setSelectedDistrict(undefined)
    }
    setCurrentPage(1) // Reset to first page when city changes
  }

  // Handle district change
  const handleDistrictChange = (value: string) => {
    if (value === ALL_OPTION_VALUE) {
      setSelectedDistrict(undefined)
    } else {
      setSelectedDistrict(value)
    }
    setCurrentPage(1) // Reset to first page when district changes
  }

  // Handle sorting change
  const handleSortingChange = (value: string) => {
    setSelectedSorting(value === ALL_OPTION_VALUE ? undefined : value)
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const handlePaperTypeChange = (value: string) => {
    setSelectedPaperType(value === ALL_OPTION_VALUE ? undefined : value)
    setCurrentPage(1)
  }

  const handleColorOptionChange = (value: string) => {
    setSelectedColorOption(value === ALL_OPTION_VALUE ? undefined : value)
    setCurrentPage(1)
  }

  const handlePrintTypeChange = (value: string) => {
    setSelectedPrintType(value === ALL_OPTION_VALUE ? undefined : value)
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

      <div className="flex w-full max-w-4xl flex-col gap-4 py-4">
        {/* Row 1: City, District, Sorting (Diğerleri) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Cities combobox */}
          <div className="relative w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedCity ? capitalizeWords(selectedCity) : "Select city"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search cities..." />
                  <CommandList>
                    <CommandItem onSelect={() => handleCityChange(ALL_OPTION_VALUE)}>
                      {ALL_OPTION_LABEL}
                    </CommandItem>
                    {turkish_cities.map((city) => (
                      <CommandItem
                        key={city.plate}
                        onSelect={() => handleCityChange(city.name)}
                      >
                        {capitalizeWords(city.name)}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Districts combobox - disabled if no city selected */}
          <div className="relative w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  disabled={!selectedCity}
                >
                  {selectedDistrict
                    ? capitalizeWords(selectedDistrict)
                    : "Select district"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search districts..." />
                  <CommandList>
                    <CommandItem onSelect={() => handleDistrictChange(ALL_OPTION_VALUE)}>
                      {ALL_OPTION_LABEL}
                    </CommandItem>
                    {availableDistricts.map((district) => (
                      <CommandItem
                        key={district}
                        onSelect={() => handleDistrictChange(district)}
                      >
                        {capitalizeWords(district)}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

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
                <SelectItem value={ALL_OPTION_VALUE}>{ALL_OPTION_LABEL}</SelectItem>
                {sortingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Row 2: Paper Type, Color, Print Type */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                <SelectItem value={ALL_OPTION_VALUE}>{ALL_OPTION_LABEL}</SelectItem>
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
                <SelectItem value={ALL_OPTION_VALUE}>{ALL_OPTION_LABEL}</SelectItem>
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
                <SelectItem value={ALL_OPTION_VALUE}>{ALL_OPTION_LABEL}</SelectItem>
                {printTypesList.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters Button */}
        <div className="flex pt-2">
          <Button variant="default" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="w-full max-w-7xl">
        <AgencyList
          province={
            selectedCity
              ? turkish_cities.find((c) => c.name === selectedCity)?.plate
              : undefined
          }
          district={
            (selectedDistrict
              ? capitalizeWords(selectedDistrict)
              : undefined) as any // Cast to any for district
          }
          orderBy={orderByNumericValue} // Use the new memoized numeric value
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
