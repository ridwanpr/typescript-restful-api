import { app } from './application/app';
import { logger } from './application/logging';

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  logger.info(`Server running on PORT ${PORT}`);
});
