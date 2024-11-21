import { SVGProcessor } from './svg-processor.js';

export class BulkOperations {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async addToQueue(svgs) {
    this.queue.push(...svgs);
    if (!this.processing) {
      await this.processQueue();
    }
  }

  async processQueue() {
    this.processing = true;
    const results = {
      successful: [],
      failed: [],
    };

    while (this.queue.length > 0) {
      const svg = this.queue.shift();
      try {
        const processed = await SVGProcessor.process(svg, {
          optimize: true,
          removeComments: true,
          removeMetadata: true,
        });

        if (processed.success) {
          results.successful.push(processed);
        } else {
          results.failed.push({
            svg,
            error: processed.error,
          });
        }
      } catch (error) {
        results.failed.push({
          svg,
          error: error.message,
        });
      }
    }

    this.processing = false;
    return results;
  }
}
