import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk";
import { DeliveryDTO, DeliveryStatus } from "../../types/delivery/common";
import {
  setStepSuccessStep,
  updateDeliveryStep,
  deleteDeliveryDriversStep,
} from "../steps";
import { findDriverStepStepId } from "../steps/find-driver";

export type WorkflowInput = {
  driver_id: string;
  delivery_id: string;
};

export const claimDeliveryWorkflow = createWorkflow<WorkflowInput, DeliveryDTO>(
  "claim-delivery-workflow",
  function (input: WorkflowData<WorkflowInput>) {
    // Update the delivery with the provided data
    const claimedDelivery = updateDeliveryStep({
      data: {
        id: input.delivery_id,
        driver_id: input.driver_id,
        delivery_status: DeliveryStatus.PICKUP_CLAIMED,
      },
    });

    // Delete the delivery drivers as they are no longer needed
    deleteDeliveryDriversStep({ delivery_id: input.delivery_id });

    // Set the step success for the find driver step
    setStepSuccessStep({
      stepId: findDriverStepStepId,
      updatedDelivery: claimedDelivery,
    });

    // Return the updated delivery
    return claimedDelivery;
  }
);
