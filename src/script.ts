import { PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()




async function main() {
    const newVideo= await prisma.video.create({
        data: {
          description: 'Fullstack tutorial for GraphQL',
          url: 'www.howtographql.com',
        },
      })
    const allVideos = await prisma.video.findMany();
    console.log(allVideos)
}

main().catch((e)=>{
    throw e;
}).finally(async () => {
    await prisma.$disconnect()
})