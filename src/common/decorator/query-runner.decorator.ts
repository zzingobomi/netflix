import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const QueryRunner = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request || !request.queryRunner) {
      throw new InternalServerErrorException('QueryRunner를 찾을 수 없습니다.');
    }

    return request.queryRunner;
  },
);
