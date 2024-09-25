import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { remoteQueryObjectFromString } from "@medusajs/utils";
import { RemoteQueryFunction } from "@medusajs/modules-sdk";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const remoteQuery: RemoteQueryFunction = req.scope.resolve("remoteQuery");
  try {
    const driverQuery = remoteQueryObjectFromString({
      entryPoint: "drivers",
      fields: ["*"],
      variables: {
        take: null,
        skip: 0,
      },
    });

    const { rows: drivers } = await remoteQuery(driverQuery);

    return res.status(200).json({ drivers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
