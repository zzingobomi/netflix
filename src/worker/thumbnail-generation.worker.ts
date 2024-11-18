import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { join } from 'path';
import * as ffmpegFluent from 'fluent-ffmpeg';
import { count } from 'console';

@Processor('thumbnail-generation')
export class ThumbnailGenerationProcess extends WorkerHost {
  async process(job: Job, token?: string) {
    const { videoId, videoPath } = job.data;

    console.log(`영상 트랜스코딩중... ID: ${videoId}`);

    const outputDirectory = join(process.cwd(), 'public', 'thumbnail');

    ffmpegFluent(videoPath)
      .screenshots({
        count: 1,
        filename: `${videoId}.png`,
        folder: outputDirectory,
        size: '320x240',
      })
      .on('end', () => {
        console.log(`썸네일 생성 완료! ID: ${videoId}`);
      })
      .on('error', (err) => {
        console.error(err);
        console.error(`썸네일 생성 실패! ID: ${videoId}`);
      });
  }
}
