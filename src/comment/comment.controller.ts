import { CommentService } from './comment.service';
import { Request, Response } from 'express';

export class CommentController {
    private readonly commentService: CommentService;

    constructor() {
        this.commentService = new CommentService();
    }

    async create(req: any, res: Response) {
        return res
            .status(200)
            .json(
                await this.commentService.createComment(
                    +req.user.id,
                    +req.params.id,
                    req.body
                )
            );
    }

    async getComments(req: Request, res: Response) {
        return res.status(200).json(
            await this.commentService.getAllComments(Number(req.params.id), {
                page: Number(req.query.page ?? 1),
                limit: Number(req.query.limit ?? 10),
                where: Number(req.params.id ?? undefined),
            })
        );
    }

    async updateComment(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.commentService.updateComment(
                    +req.user!.id,
                    +req.params.commentId,
                    +req.params.postId,
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
                    Number(req.params.commentId),
                    req.body.reaction
                )
            );
    }

    async getReactions(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.commentService.getReactions(
                    Number(req.params.commentId)
                )
            );
    }

    async createReport(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.commentService.reportComment(
                    Number(req.user?.id),
                    Number(req.params.commentId),
                    req.body
                )
            );
    }

    async deleteComment(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.commentService.deleteComment(
                    +req.params.commentId,
                    +req.user!.id,
                    +req.params.postId
                )
            );
    }
}
