import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/medusa";
import RestaurantModuleService from "../../../modules/restaurant/service";
import DeliveryModuleService from "../../../modules/delivery/service";
import { RESTAURANT_MODULE } from "../../../modules/restaurant";
import { DELIVERY_MODULE } from "../../../modules/delivery";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { user_id, actor_type } = req.user as {
    user_id: string;
    actor_type: "restaurant" | "driver";
  };

  if (actor_type === "restaurant") {
    const service: RestaurantModuleService = req.scope.resolve(RESTAURANT_MODULE);
    const user = await service.retrieveRestaurantAdmin(user_id)
    return res.json({ user });
  }

  if (actor_type === "driver") {
    const service: DeliveryModuleService = req.scope.resolve(DELIVERY_MODULE);
    const user = await service.retrieveDriver(user_id);
    return res.json({ user });
  }

  return res.status(404).json({ message: "User not found" });
};
