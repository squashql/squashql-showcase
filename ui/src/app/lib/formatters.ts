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

const percentFormatter: Formatter = {
  label: "12.15%",
  formatter: (v: any) => percentf.format(v)
}

const usdFormatter: Formatter = {
  label: "$4,999.99",
  formatter: (v: any) => usdf.format(v)
}

const eurFormatter: Formatter = {
  label: "€4,999.99",
  formatter: (v: any) => eurf.format(v)
}

const cashFormatter: Formatter = {
  label: "5K",
  formatter: (v: any) => cashf.format(v)
}

export const defaultNumberFormatter: Formatter = {
  label: "4,999.99",
  formatter: (v: any) => nf.format(v)
}

const none: Formatter = {
  label: "None",
  formatter: (v: any) => v
}

export const formatters = [none, defaultNumberFormatter, usdFormatter, eurFormatter, cashFormatter, percentFormatter]
