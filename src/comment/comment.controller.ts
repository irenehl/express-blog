import aws from '../config/aws';
import prisma from '../config/prisma.client';
import { CommentService } from './comment.service';
import { Request, Response } from 'express';

export class CommentController {
    private readonly commentService: CommentService;

    constructor() {
        this.commentService = new CommentService(aws, prisma);
    }

    async create(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.commentService.createComment(
                    Number(req.user?.id),
                    Number(req.params.id),
                    req.body
                )
            );
    }

    async getComments(req: Request, res: Response) {
        return res.status(200).json(
            await this.commentService.getAllComments(Number(req.params.id), {
                page: Number(req.query.page ?? 1),
                limit: Number(req.query.limit ?? 15),
                where: Number(req.params.id ?? undefined),
            })
        );
    }

    async updateComment(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.commentService.updateComment(
                    Number(req.user?.id),
                    Number(req.params.id),
                    req.body
                )
            );
    }

    async reactionOnComment(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.commentService.reactionOnComment(
                    Number(req.user?.id),
                    Number(req.params.id),
                    req.body.reaction
                )
            );
    }

    async getReactions(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.commentService.getReactions(Number(req.params.id))
            );
    }

    async createReport(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.commentService.reportComment(
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
                await this.commentService.getReports(
                    Number(req.user?.id),
                    Number(req.params.id)
                )
            );
    }

    async deleteComment(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.commentService.deleteComment(
                    Number(req.params.id),
                    Number(req.user?.id)
                )
            );
    }
}
