import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  Request,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Version,
  VERSION_NEUTRAL,
  Req,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieTitleValidationPipe } from './pipe/movie-title-validation.pipe';
import { Public } from 'src/auth/decorator/public.decorator';
import { RBAC } from 'src/auth/decorator/rbac.decorator';
//import { Role } from 'src/user/entities/user.entity';
import { GetMoviesDto } from './dto/get-movies.dto';
import { CacheInterceptor } from 'src/common/interceptor/cache.interceptor';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { MovieFilePipe } from './pipe/movie-file.pipe';
import { UserId } from 'src/user/decorator/user-id.decorator';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
import {
  CacheKey,
  CacheTTL,
  CacheInterceptor as CI,
} from '@nestjs/cache-manager';
import { Throttle } from 'src/common/decorator/throttle.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from '@prisma/client';

// @Controller({
//   path: 'movie',
//   version: '2',
// })
// export class MovieControllerV2 {
//   @Get()
//   getMovies() {
//     return [];
//   }
// }

// @Controller({
//   path: 'movie',
//   version: '1',
//   //version: VERSION_NEUTRAL
// })
@Controller('movie')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Public()
  @Get()
  // @UseInterceptors(CacheInterceptor)
  @Throttle({
    count: 5,
    unit: 'minute',
  })
  //@Version('5')
  @ApiOperation({ description: '[Movie]를 Pagination하는 API' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 API Pagination을 실행 했을때!',
  })
  @ApiResponse({
    status: 400,
    description: 'Pagination 데이터를 잘못 입력했을때',
  })
  getMovies(@Query() dto: GetMoviesDto, @UserId() userId?: number) {
    return this.movieService.findAll(dto, userId);
  }

  /// /movie/recent
  @Get('recent')
  // URL 별로 캐시키가 설정된다. (queryParams 가 다르면 다른 키가 된다)
  @UseInterceptors(CI)
  //@CacheKey('getMoviesRecent')
  //@CacheTTL(1000)
  getMoviesRecent() {
    return this.movieService.findRecent();
  }

  @Public()
  @Get(':id')
  getMovie(@Param('id', ParseIntPipe) id: number, @Req() request: any) {
    const session = request.session;

    const movieCount = session.movieCount ?? {};

    request.session.movieCount = {
      ...movieCount,
      [id]: movieCount[id] ? movieCount[id] + 1 : 1,
    };

    console.log(session);

    return this.movieService.findOne(id);
  }

  @Post()
  @RBAC(Role.admin)
  // @UseInterceptors(TransactionInterceptor)
  postMovie(
    @Body() body: CreateMovieDto,
    // @QueryRunner() queryRunner: QR,
    @UserId() userId: number,
  ) {
    return this.movieService.create(
      body,
      userId,
      //queryRunner
    );
  }

  @Patch(':id')
  @RBAC(Role.admin)
  patchMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMovieDto,
  ) {
    return this.movieService.update(id, body);
  }

  @Delete(':id')
  @RBAC(Role.admin)
  deleteMovie(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.remove(id);
  }

  /**
   * [Like] [DisLike]
   *
   * 아무것도 누르지 않은 상태
   * Like & DisLike 모두 버튼 꺼져있음
   */
  @Post(':id/like')
  createMovieLike(
    @Param('id', ParseIntPipe) movieId: number,
    @UserId() userId: number,
  ) {
    return this.movieService.toggleMovieLike(movieId, userId, true);
  }

  @Post(':id/dislike')
  createMovieDislike(
    @Param('id', ParseIntPipe) movieId: number,
    @UserId() userId: number,
  ) {
    return this.movieService.toggleMovieLike(movieId, userId, false);
  }
}
