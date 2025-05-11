const { productService } = require("../services/products-service")

async function createProduct(paperType, colorOption, printType) {
  try {
    await productService.createProduct(paperType, colorOption, printType)
    console.log(`Created ${paperType} ${colorOption} ${printType}`)
  } catch (error) {
    if (error instanceof Error && error.message?.includes("already exists")) {
      console.log(`${paperType} ${colorOption} ${printType} already exists`)
    } else {
      throw error
    }
  }
}

async function createMissingProducts() {
  // A4 Products
  await createProduct("A4", "Renkli", "TekYuz")
  await createProduct("A4", "Renkli", "CiftYuz")
  await createProduct("A4", "SiyahBeyaz", "TekYuz")
  await createProduct("A4", "SiyahBeyaz", "CiftYuz")

  // A6 Products
  await createProduct("A6", "Renkli", "TekYuz")
  await createProduct("A6", "Renkli", "CiftYuz")
  await createProduct("A6", "SiyahBeyaz", "TekYuz")
  await createProduct("A6", "SiyahBeyaz", "CiftYuz")
}

createMissingProducts().catch(console.error)
