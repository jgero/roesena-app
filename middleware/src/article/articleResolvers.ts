import { Article } from "../interfaces"

const articleData: Article[] = [
  { _id: "asdf", content: "testcontent", date: 20191002, images: ["asdftestID"], title: "firstarticle" },
  { _id: "jklö", content: "testcontent", date: 20191002, images: ["asdftestID"], title: "secondarticle" }
]

export function articles(): Article[] {
  return articleData;
}

export function article(args: any): Article | undefined {
  return articleData.find(el => el._id === args._id);
}