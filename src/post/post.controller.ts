import aws from '../config/aws';
import prisma from '../config/prisma.client';
import { PostService } from './post.service';
import { Request, Response } from 'express';

export class PostController {
    private readonly postService: PostService;

    constructor() {
        this.postService = new PostService(aws, prisma);
    }

    async create(req: any, res: Response) {
        return res
            .status(200)
            .json(
                await this.postService.createPost(
                    Number(req.user?.id),
                    req.body
                )
            );
    }

    async getPost(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.postService.getPost({ id: Number(req.params.id) })
            );
    }

    async getAll(req: Request, res: Response) {
        return res.status(200).json(
            await this.postService.getAll({
                page: Number(req.query.page ?? 1),
                limit: Number(req.query.limit ?? 10),
            })
        );
    }

    async updatePost(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.postService.updatePost(
                    Number(req.user?.id),
                    Number(req.params.id),
                    req.body
                )
            );
    }

    async reactionOnPost(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.postService.reactionOnPost(
                    Number(req.user?.id),
                    Number(req.params.id),
                    req.body.reaction
                )
            );
    }

    async getReaction(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.postService.getReactions(Number(req.params.id)));
    }

    async reportPost(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.postService.reportPost(
                    Number(req.user?.id),
                    Number(req.params.id),
                    req.body
                )
            );
    }

    async getReports(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.postService.getReports(
                    Number(req.user?.id),
                    Number(req.params.id)
                )
            );
    }

    async deletePost(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.postService.deletePost(
                    Number(req.user?.id),
                    Number(req.params.id)
                )
            );
    }
}
