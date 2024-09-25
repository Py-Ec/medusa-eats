import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils";
import { 
  deleteProductsWorkflow
} from "@medusajs/core-flows";
import {
  createRestaurantProductsWorkflow,
} from "../../../../workflows/restaurant/workflows";
import { 
  AdminCreateProduct,
} from "@medusajs/medusa/dist/api/admin/products/validators"
import { z } from "zod";

const createSchema = z.object({
  products: AdminCreateProduct().array()
})

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const validatedBody = createSchema.parse(req.body)

  const { result: restaurantProducts } = await createRestaurantProductsWorkflow(
    req.scope
  ).run({
    input: {
      products: validatedBody.products as any[],
      restaurant_id: req.params.id,
    },
  });

  // Return the product
  return res.status(200).json({ restaurant_products: restaurantProducts });
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const restaurantId = req.params.id;

  if (!restaurantId) {
    return MedusaError.Types.NOT_FOUND;
  }

  const remoteQuery = req.scope.resolve(
    ContainerRegistrationKeys.REMOTE_QUERY
  );

  const restaurantProductsQuery = remoteQueryObjectFromString({
    entryPoint: "products",
    // variables: {
    //   filters: {
    //     restaurant: restaurantId,
    //   },
    // },
    fields: [
      "id",
      "title",
      "description",
      "thumbnail",
      "categories",
      "categories.id",
      "categories.name",
      "variants",
      "variants.id",
      "variants.price_set",
      "variants.price_set.id",
      "restaurant.*",
    ],
  });

  const restaurantProducts = await remoteQuery(restaurantProductsQuery);

  return res.status(200).json({ restaurant_products: restaurantProducts });
}

const deleteSchema = z.object({
  product_ids: z.string().array(),
});

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const validatedBody = deleteSchema.parse(req.body);

  await deleteProductsWorkflow(req.scope).run({
    input: {
      ids: validatedBody.product_ids,
    },
  });

  return res.status(200).json({ success: true });
}
