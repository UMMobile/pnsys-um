import { initOneSignalClient } from "./providers";
import { pushnotifications as pn} from "../../config";

export const getPushClient = () =>  {
  switch (pn.provider) {
    case 'os':
      return initOneSignalClient(pn.keys);
  }
}