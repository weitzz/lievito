export const pizzaSizes = [
  { id: "small", label: "Pequena", priceAdjustmentInCents: -800 },
  { id: "medium", label: "Média", priceAdjustmentInCents: 0 },
  { id: "large", label: "Grande", priceAdjustmentInCents: 1000 },
] as const

export const pizzaCrusts = [
  { id: "traditional", label: "Tradicional", priceAdjustmentInCents: 0 },
  { id: "catupiry", label: "Recheada com Catupiry", priceAdjustmentInCents: 800 },
  { id: "cheddar", label: "Recheada com Cheddar", priceAdjustmentInCents: 800 },
] as const

export const extraIngredients = [
  { id: "bacon", label: "Bacon extra", priceAdjustmentInCents: 500 },
  { id: "catupiry", label: "Catupiry extra", priceAdjustmentInCents: 500 },
  { id: "cheddar", label: "Cheddar extra", priceAdjustmentInCents: 500 },
  { id: "mozzarella", label: "Mussarela extra", priceAdjustmentInCents: 500 },
  { id: "mushroom", label: "Champignon extra", priceAdjustmentInCents: 400 },
] as const

export type PizzaSizeId = (typeof pizzaSizes)[number]["id"]
export type PizzaCrustId = (typeof pizzaCrusts)[number]["id"]
export type ExtraIngredientId = (typeof extraIngredients)[number]["id"]

export type PizzaConfiguration = {
  size: PizzaSizeId
  crust: PizzaCrustId
  extras: ExtraIngredientId[]
  removedIngredients: string[]
}

export const isPizzaSizeId = (value: unknown): value is PizzaSizeId =>
  typeof value === "string" && pizzaSizes.some((size) => size.id === value)

export const isPizzaCrustId = (value: unknown): value is PizzaCrustId =>
  typeof value === "string" && pizzaCrusts.some((crust) => crust.id === value)

export const isExtraIngredientId = (value: unknown): value is ExtraIngredientId =>
  typeof value === "string" && extraIngredients.some((ingredient) => ingredient.id === value)

export const getPizzaIngredients = (ingredients?: string | null) =>
  ingredients
    ?.split(",")
    .map((ingredient) => ingredient.trim())
    .filter(Boolean) ?? []

export const getPizzaPriceInCents = (basePrice: number, configuration: PizzaConfiguration) => {
  const size = pizzaSizes.find((option) => option.id === configuration.size)
  const crust = pizzaCrusts.find((option) => option.id === configuration.crust)
  const extrasPrice = configuration.extras.reduce((total, extraId) => {
    const extra = extraIngredients.find((option) => option.id === extraId)
    return total + (extra?.priceAdjustmentInCents ?? 0)
  }, 0)

  return Math.round(basePrice * 100)
    + (size?.priceAdjustmentInCents ?? 0)
    + (crust?.priceAdjustmentInCents ?? 0)
    + extrasPrice
}

export const getPizzaConfigurationDescription = (configuration: PizzaConfiguration) => {
  const size = pizzaSizes.find((option) => option.id === configuration.size)
  const crust = pizzaCrusts.find((option) => option.id === configuration.crust)
  const extras = configuration.extras
    .map((id) => extraIngredients.find((option) => option.id === id)?.label)
    .filter(Boolean)

  return [
    `Tamanho: ${size?.label ?? "Média"}`,
    `Borda: ${crust?.label ?? "Tradicional"}`,
    extras.length ? `Extras: ${extras.join(", ")}` : null,
    configuration.removedIngredients.length
      ? `Sem: ${configuration.removedIngredients.join(", ")}`
      : null,
  ].filter(Boolean).join("; ")
}
