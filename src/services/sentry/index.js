import * as Sentry from "@sentry/node"
import { sentry as sentryConfig } from "../../config"

export default () => {
    Sentry.init(sentryConfig)

    Sentry.testTransaction = () => {
        const transaction = Sentry.startTransaction({
          op: "test",
          name: "Test Transaction",
        });
        
        setTimeout(() => {
          try {
            foo()
          } catch (e) {
            Sentry.captureException(e)
          } finally {
            transaction.finish()
          }
        }, 99);
    }

    return Sentry
}
