export interface Formatter {
  label: string
  formatter: (v: any) => string
}

const nf = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 2})
const eurf = new Intl.NumberFormat("en-US", {style: "currency", currency: "EUR"})
const usdf = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"})
const percentf = new Intl.NumberFormat("en-US", {style: 'percent', minimumFractionDigits: 2})
const cashf = Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1
})

export const percentFormatter: Formatter = {
  label: "12.15%",
  formatter: (v: any) => percentf.format(v)
}

export const usdFormatter: Formatter = {
  label: "$4,999.99",
  formatter: (v: any) => usdf.format(v)
}

export const eurFormatter: Formatter = {
  label: "€4,999.99",
  formatter: (v: any) => eurf.format(v)
}

export const cashFormatter: Formatter = {
  label: "5K",
  formatter: (v: any) => cashf.format(v)
}

export const defaultNumberFormatter: Formatter = {
  label: "4,999.99",
  formatter: (v: any) => nf.format(v)
}

export const none: Formatter = {
  label: "None",
  formatter: (v: any) => v
}

export const var95fDateOnly: Formatter = {
  label: "VaR 95 - Date",
  formatter: (value: any) => {
    if (value) {
      return new Date(value[0], value[1] - 1, value[2]).toLocaleDateString()
    }
    return ""
  }
}

export const formatters = [none,
  defaultNumberFormatter, usdFormatter, eurFormatter, cashFormatter, percentFormatter, var95fDateOnly]
