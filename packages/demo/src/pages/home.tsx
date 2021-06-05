import { mdiChevronRight, mdiInformationOutline, mdiMagnify } from "@mdi/js"
import Icon from "@mdi/react"
import React, { useState, useEffect, useCallback } from "react"
import { Select, Input, Card, Loader } from "../components"
import { Category, Template } from "../types"
import { getTemplates } from "../utils/rest"

type PaginationComponent = {
  length: number
  page: number
  onNext: () => void
  onPrev: () => void
}

const Pagination: React.FC<PaginationComponent> = ({
  onNext,
  onPrev,
  page = 1,
  length,
}) => {
  return (
    <div className="flex justify-space-between margin-y-lg padding-x-lg sm-padding-x-sm">
      <div className="text-align-left">
        <button
          onClick={() => {
            onPrev()
          }}
        >
          Previous
        </button>
      </div>
      <div className="flex justify-center align-center">
        <div className="flex">
          <div className="btn margin-x-xs">{page}</div> of {length}
        </div>
      </div>
      <div className="text-align-right">
        <button
          onClick={() => {
            onNext()
          }}
        >
          <div className="flex ">
            Next
            <Icon path={mdiChevronRight} size={1} color="#222" />
          </div>
        </button>
      </div>
    </div>
  )
}

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("Health")
  const [orderBy, setOrderBy] = useState<"ASC" | "DESC">("ASC")
  const [orderKey, setOrderKey] = useState<"name" | "created">("name")
  const [templates, setTemplates] = useState<Template[]>()
  const [tmpTemplates, setTempTemplates] = useState<Template[] | any>()
  const [searchValue, setSearchValue] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [pageLength, setPageLength] = useState<number>(1)
  const [perPage] = useState<number>(12)
  const [paginationIdx, setPaginationIdx] = useState<{
    start: number
    end: number
  }>()

  // set the temporary template data before sorting and filtering
  useEffect(() => {
    let current = true

    if (current) {
      getTemplates().then(resp => {
        setTempTemplates(resp.data)
      })
    }
    return () => {
      current = false
    }
  }, [])

  // filter through the template data with given search value
  const handleSearch = useCallback(
    (template: any): boolean => {
      if (searchValue.length) {
        for (let key in template) {
          let value: any = template[key]
          let found = undefined

          // check if value is a string or number
          if (typeof value === "string" || typeof value === "number") {
            found = ("" + value)
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          } else if (Array.isArray(value)) {
            value.forEach((item: string) => {
              found = item.toLowerCase().includes(searchValue.toLowerCase())
            })
          }
          if (found) {
            return true
          }
        }
        return false
      }
      return true
    },
    [searchValue, activeCategory]
  )

  // sort the template by category
  const handleSortCategory = useCallback(
    (templates: Template[] | undefined): Template[] | undefined => {
      if (activeCategory !== "All") {
        const tmp: Template[] | undefined = []
        templates?.forEach(template => {
          for (let i = 0; i < template.category.length; i++) {
            const item = template.category[i]
            if (item.toLowerCase() === activeCategory.toLowerCase()) {
              tmp.push(template)
              return
            }
          }
        })
        return tmp
      }
      return templates
    },
    [activeCategory]
  )

  // use a merge sort to sort the data by selector given in the argument
  const sortByASC = (selector: string, unsortedData: any[]): any[] => {
    const merge = (left: any, right: any) => {
      let resultArray = [],
        leftIndex = 0,
        rightIndex = 0
      while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex][selector] < right[rightIndex][selector]) {
          resultArray.push(left[leftIndex])
          leftIndex++
        } else {
          resultArray.push(right[rightIndex])
          rightIndex++
        }
      }

      return resultArray
        .concat(left.slice(leftIndex))
        .concat(right.slice(rightIndex))
    }

    const mergeSort = (unsortedData: any[]): any[] => {
      if (unsortedData.length <= 1) {
        return unsortedData
      }

      const middle = Math.floor(unsortedData.length / 2)

      const left = unsortedData.slice(0, middle)
      const right = unsortedData.slice(middle)

      return merge(mergeSort(left), mergeSort(right))
    }
    return mergeSort(unsortedData)
  }

  const sortByDESC = (selector: string, unsortedData: any[]): any[] => {
    return sortByASC(selector, unsortedData).reverse()
  }

  const handleOrder = useCallback(
    tmpTemplates => {
      if (orderBy === "DESC") {
        return sortByDESC(orderKey, tmpTemplates)
      } else {
        return sortByASC(orderKey, tmpTemplates)
      }
    },
    [orderBy, orderKey]
  )

  // sort by category then filter through the templates
  useEffect(() => {
    if (tmpTemplates) {
      const sortedCategory = handleSortCategory(tmpTemplates)
      const sortedOrder = handleOrder(sortedCategory)
      setTemplates(
        sortedOrder?.filter((template: Template) => handleSearch(template))
      )
    }
  }, [handleSearch, tmpTemplates, handleSortCategory, handleOrder])

  const handleNextPageClick = useCallback(() => {
    if (page < pageLength) {
      setPage(prev => prev + 1)
      let start = perPage * page
      setPaginationIdx({ start: start, end: start + perPage })
    }
  }, [pageLength, page, perPage])

  const handlePrevPageClick = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1)
      let start = perPage * (page - 2)
      setPaginationIdx({ start: start, end: start + perPage })
    }
  }, [perPage, page])

  const calculatePageLength = useCallback((): number => {
    // template length
    const length = templates?.length || 1
    setPaginationIdx({ start: 0, end: perPage })
    if (length < perPage) {
      setPageLength(1)
      return 1
    } else {
      const remainder = length % perPage
      let result = length / perPage
      if (remainder) {
        result = Math.floor(result) + 1
      }

      setPageLength(result)
      return result
    }
  }, [templates, perPage])

  useEffect(() => {
    calculatePageLength()
  }, [calculatePageLength])

  return (
    <div className="page-padding">
      <div className="flex align-flex-start justify-space-between margin-y-md xs-flex-column">
        <div className="xs-margin-y-md">
          <Input
            onInputChange={(value: string) => setSearchValue(value)}
            id="input-search"
            className="search-bar"
            iconRight
            placeholder="Search Templates"
            icon={mdiMagnify}
            iconBorder={false}
          />
        </div>
        <div className="flex xs-flex-column">
          <p className="margin-x-sm text-align-left">Sort By: </p>
          <div className="grid grid-col-3 grid-gap-md sm-grid-col-2 xs-grid-col-1 filters">
            <Select
              label="Category"
              options={["All", "Health", "Education", "E-commerce"]}
              defaultSelected={"All"}
              onInputSelect={(value: any) => setActiveCategory(value)}
              id="sort"
            />
            <Select
              label="Filter"
              options={["Name", "Created"]}
              defaultSelected={"Name"}
              onInputSelect={(value: any) => setOrderKey(value.toLowerCase())}
              id="sort"
            />
            <Select
              label="Order"
              options={["ASC", "DESC"]}
              defaultSelected={"ASC"}
              onInputSelect={(value: any) => setOrderBy(value)}
              id="sort"
            />
          </div>
        </div>
      </div>

      <div className="information-tag flex justify-center padding-y-sm border-radius-3 padding-x-sm background-warning-fade margin-y-lg">
        <Icon path={mdiInformationOutline} color={"orange"} size={1} />
        <p className="padding-x-sm ">
          Tada! Get started with a free template. Can't find what you are
          looking for? Search from the 1000+ available templates
        </p>
      </div>

      <div className="margin-y-sm flex justify-space-between">
        <h1 className="text-align-left">{activeCategory} Templates</h1>
        <p className="color-fade text-align-right">
          {templates?.length} templates
        </p>
      </div>

      <div id="templates-container">
        {templates?.length ? (
          <div className="grid grid-gap-lg grid-col-3 md-grid-col-2 xs-grid-col-1 xs-grid-gap-sm">
            {templates
              ?.slice(paginationIdx?.start, paginationIdx?.end)
              .map(
                (
                  { name, link, created, category, description }: Template,
                  idx: number
                ) => (
                  <Card
                    link={link}
                    name={name}
                    category={category}
                    description={description}
                    created={created}
                    key={idx}
                  />
                )
              )}
          </div>
        ) : (
          <Loader
            width="100%"
            height="100%"
            type="spinner"
            withBackground={false}
            iconSize={1.5}
            style={{ position: "relative" }}
          />
        )}
      </div>
      <Pagination
        length={pageLength}
        page={page}
        onNext={handleNextPageClick}
        onPrev={handlePrevPageClick}
      />
    </div>
  )
}

export default HomePage
