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

let videos: NexusGenObjects["Video"][] = [
    {
        id:1,
        url:"test.com",
        description:"testing"
    },
]

export const VideoQuery = extendType({
    type: "Query",
    definition(t){
        t.nonNull.list.nonNull.field("feed", {
            type: "Video",
            resolve(parent, args, context, info){
                return videos;
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
                const {description, url} = args;

                let idCount = videos.length + 1;
                const video = {
                    id: idCount,
                    description: description,
                    url: url
                }
                videos.push(video);
                return video;
            }
        })
    }
})