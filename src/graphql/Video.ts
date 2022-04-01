import { objectType, extendType, nonNull, stringArg } from "nexus";
import {NexusGenObjects} from '../../nexus-typegen'

export const Video = objectType({
    name: "Video", // 1 
    definition(t) {  // 2
        t.nonNull.int("id"); // 3 
        t.nonNull.string("description"); // 4
        t.nonNull.string("url"); // 5 
    },
});

export const VideoQuery = extendType({
    type: "Query",
    definition(t){
        t.nonNull.list.nonNull.field("feed", {
            type: "Video",
            resolve(parent, args, context, info){
                return context.prisma.video.findMany();
            }
        })
    }
})

export const VideoMutation = extendType({
    type: "Mutation",
    definition(t){
        t.nonNull.field("post", {
            type: "Video",
            args: {
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },

            resolve(parent, args, context){
                const newVideo = context.prisma.video.create({   // 2
                    data: {
                        description: args.description,
                        url: args.url,
                    },
                });
                return newVideo;
            },
            
        })
    }
})