import { productService } from "../services/products-service"

async function createA4ColoredProducts() {
  // Create A4 Colored Single-Sided
  try {
    await productService.createProduct("A4", "Renkli", "TekYuz")
    console.log("Created A4 Colored Single-Sided")
  } catch (error) {
    if (error.message?.includes("already exists")) {
      console.log("A4 Colored Single-Sided already exists")
    } else {
      throw error
    }
  }

  // Create A4 Colored Double-Sided
  try {
    await productService.createProduct("A4", "Renkli", "CiftYuz") 
    console.log("Created A4 Colored Double-Sided")
  } catch (error) {
    if (error.message?.includes("already exists")) {
      console.log("A4 Colored Double-Sided already exists")
    } else {
      throw error
    }
  }
}

createA4ColoredProducts().catch(console.error)
