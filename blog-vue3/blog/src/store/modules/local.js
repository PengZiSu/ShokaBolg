import { defineStore } from "pinia";
import { getImgUrl } from "@/utils/common";

const useLocalStore = defineStore("useLocalStore", {
  state: () => ({
    articleList: [],
    articleInfoList: [],
    categoryList: [],
    tagList: [],
    categoryArticleList: [],
    tagArticleList: [],
  }),

  actions: {
    /**
     * 加载本地文章
     */
    loadArticle() {
      const mdList = import.meta.glob("@/assets/article/*.md", {
        eager: true,
        as: "raw",
      });
      const mdPathList = Object.keys(mdList);
      mdPathList.forEach((path, index) =>
        this.parseArticle(mdList[path], index)
      );

      for (let i = 0; i < this.articleInfoList.length; i++) {
        if (i !== 0) {
          this.articleInfoList[i].lastArticle = {
            id: this.articleInfoList[i - 1].id,
            articleTitle: this.articleInfoList[i - 1].articleTitle,
            articleCover: this.articleInfoList[i - 1].articleCover,
          };
        }
        if (i !== this.articleInfoList.length - 1) {
          this.articleInfoList[i].nextArticle = {
            id: this.articleInfoList[i + 1].id,
            articleTitle: this.articleInfoList[i + 1].articleTitle,
            articleCover: this.articleInfoList[i + 1].articleCover,
          };
        }
      }
    },

    /**
     * 解析文章
     * @param articleContent 文章内容
     * @param index 文章id
     */
    parseArticle(articleContent, index) {
      const frontMatter = {
        title: "无标题",
        cover: getImgUrl("articleCover"),
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`,
        category: "默认分类",
        tags: [],
      };
      if (articleContent.startsWith("---")) {
        let meta = articleContent.substring(
          5,
          articleContent.indexOf("---", 3) - 2
        );

        meta.split("\n").forEach((line) => {
          const match1 = line.match(/(\w+):\s*(.*)/);
          const match2 = line.match(/ - (\S+)/);

          if (match1) {
            const [, key, value] = match1;
            if (key === "title") {
              frontMatter.title = value;
            } else if (key === "cover") {
              frontMatter.cover = getImgUrl(value);
            } else if (key === "date") {
              frontMatter.date = value;
            } else if (key === "category") {
              frontMatter.category = value;
            }
          } else if (match2) {
            frontMatter.tags.push(match2[1]);
          }
        });
      }

      // 替换图片路径
      articleContent = articleContent.replace(
        /(!\[.*])\((.*)\)/g,
        (match, p1, p2) => {
          let imgName = p2.substring(p2.lastIndexOf("/") + 1);
          console.log(`${p1}(${getImgUrl(imgName)})`);
          return `${p1}(${getImgUrl(imgName)})`;
        }
      );

      const category = this.addCategory(frontMatter.category, index);
      const tags = [];
      frontMatter.tags.forEach((tag) => {
        tags.push(this.addTag(tag, index));
      });

      const articleInfo = {
        id: index,
        articleCover: frontMatter.cover,
        articleTitle: frontMatter.title,
        articleContent: articleContent.substring(
          articleContent.indexOf("---", 3) + 3
        ),
        articleType: 1,
        viewCount: 0,
        likeCount: 0,
        category: category,
        tagList: tags,
        createTime: frontMatter.date,
        updateTime: frontMatter.date,
      };

      this.articleInfoList.push(articleInfo);
      this.articleList.push(articleInfoToArticle(articleInfo));
    },

    /**
     * 添加分类,如果已存在则返回已存在的分类
     * @param categoryName 分类名称
     * @param articleId 文章id
     */
    addCategory(categoryName, articleId) {
      if (
        !this.categoryList.some(
          (category) => category.categoryName === categoryName
        )
      ) {
        this.categoryList.push({
          id: this.categoryList.length,
          categoryName: categoryName,
          articleCount: 0,
        });
        this.categoryArticleList.push([]);
      }
      const index = this.categoryList.findIndex(
        (category) => category.categoryName === categoryName
      );
      this.categoryList[index].articleCount++;
      this.categoryArticleList[index].push(articleId);
      return this.categoryList[index];
    },

    /**
     * 添加标签,如果已存在则返回已存在的标签
     * @param tagName 标签名称
     * @param articleId 文章id
     */
    addTag(tagName, articleId) {
      if (!this.tagList.some((tag) => tag.tagName === tagName)) {
        this.tagList.push({
          id: this.tagList.length,
          tagName: tagName,
          articleCount: 0,
        });
        this.tagArticleList.push([]);
      }
      const index = this.tagList.findIndex((tag) => tag.tagName === tagName);
      this.tagList[index].articleCount++;
      this.tagArticleList[index].push(articleId);
      return this.tagList[index];
    },

    /**
     * 根据分类id获取文章列表
     * @param id 分类id
     */
    getArticlesByCategoryId(id) {
      return {
        articleConditionList: this.generateArticleConditionList(
          this.categoryArticleList[id]
        ),
        name: this.categoryList[id].categoryName,
      };
    },

    /**
     * 根据标签id获取文章列表
     * @param id 标签id
     */
    getArticlesByTagId(id) {
      return {
        articleConditionList: this.generateArticleConditionList(
          this.tagArticleList[id]
        ),
        name: this.tagList[id].tagName,
      };
    },

    /**
     * 生成文章条件列表
     * @param articleIdList 文章id列表
     */
    generateArticleConditionList(articleIdList) {
      const articleList = [];
      articleIdList.forEach((articleId) => {
        const article = {
          id: articleId,
          articleCover: this.articleInfoList[articleId].articleCover,
          articleTitle: this.articleInfoList[articleId].articleTitle,
          tagList: this.articleInfoList[articleId].tagList,
          category: this.articleInfoList[articleId].category,
          createTime: this.articleInfoList[articleId].createTime,
        };
        articleList.push(article);
      });
      return articleList;
    },

    /**
     * 初始化博客信息
     */
    initBlogInfo() {
      return {
        status: 1,
        articleCount: 0,
        categoryCount: 0,
        tagCount: 0,
        viewCount: 0,
        siteConfig: {
          id: 0,
          userAvatar: getImgUrl("userAvatar"),
          touristAvatar: getImgUrl("defaultAvatar"),
          siteName: "baby-su",
          siteAddress: "https://github.com/PengZiSu",
          siteIntro: "(●ˇ∀ˇ●) 哎嘿~",
          siteNotice:
            '这是一条测试公告<br/>可以显示html内容<br/>如:<b>加粗</b>,<span style="color: red">变色</span>,' +
            '或者是<a class="underline-a" href="https://bing.com">超链接</a>等',
          createSiteTime: "2023-01-01",
          recordNumber: "粤ICP备2022048542号",
          authorAvatar: getImgUrl("authorAvatar"),
          siteAuthor: "sulinye",
          articleCover: "",
          aboutMe:
            "------------------------------------\n" +
            "\n" +
            "## 项目地址\n" +
            "项目链接： [**https://github.com/PengZiSu**](https://github.com/PengZiSu)\n" +
            "后台链接： [**https://github.com/PengZiSu**](https://github.com/PengZiSu)\n" +
            "测试账号： `test@qq.com`，密码：`123456`\n" +
            "Github 地址： [**https://github.com/PengZiSu**](https://github.com/PengZiSu)\n" +
            "Gitee 地址： [**https://gitee.com/su-linye**](https://gitee.com/su-linye)\n" +
            "接口文档：[**https://121.37.175:8080/doc.html**](https://121.37.175:8080/doc.html) (忘记设置nginx了)\n" +
            "\n" +
            "------------------------------------\n" +
            "\n" +
            "## 项目特点\n" +
            "- 前台界面参考 `Hexo` 的 `Shoka` 和 `Butterfly` 设计，页面美观，响应式布局\n" +
            "- 后台管理基于若依二次开发，含有侧边栏，历史标签，面包屑等\n" +
            "- 采用 `RABC` 权限模型，使用 `Sa-Token` 进行权限管理\n" +
            "- 支持代码高亮、图片预览、黑夜模式、评论、点赞、取消点赞等功能\n" +
            "- 发送 `HTML` 邮件评论回复提醒，内容详细\n" +
            "- 文章编辑使用 `Markdown` 编辑器\n" +
            "- 代码遵循阿里巴巴开发规范\n" +
            "\n" +
            "------------------------------------\n" +
            "\n" +
            "## 技术栈\n" +
            "前端： `Vue3` + `Vite4` + `Pinia` + `Vue Router` + `JavaScript` + `Axios` + `Element Plus` + `Naive UI` + `Echarts` + `Swiper`等\n" +
            "后端： `SpringBoot3` + `Mysql` + `Redis` + `Thymeleaf` + `Nginx` + `Sa-Token` + `Swagger3` + `MyBatisPlus` + `RabbitMQ`（未实装）等\n" +
            "\n" +
            "------------------------------------\n" +
            "\n" +
            "## 运行环境\n" +
            "服务器:华为云2核2G CentOS 7.9\n" +
            "对象存储：阿里云\n" +
            "\n" +
            "------------------------------------\n" +
            "\n" +
            "## 开发环境\n" +
            "|开发工具 |版本|说明|\n" +
            "|-|-|-|\n" +
            "|IDEA|2023.1.2|JAVA及VUE开发工具IDE|\n" +
            "|navicat|16.0.11|MYSQL操作工具|\n" +
            "|tabby|/|Linux连接工具,附ftp功能|\n" +
            "\n" +
            "|开发环境 |版本|\n" +
            "|-|-|\n" +
            "|OpenJDK|17|\n" +
            "|Redis|7.0|\n" +
            "|vue|3.2.47|\n" +
            "|vite|4.2.1|\n" +
            "|springboot|3.0.4|\n" +
            "\n" +
            "------------------------------------\n",
          github: "https://github.com/PengZiSu",
          gitee: "https://gitee.com/su-linye",
          bilibili: "https://space.bilibili.com/478956532",
          qq: "2625070801",
          commentCheck: 0,
          messageCheck: 0,
          emailNotice: 0,
          socialList: "qq,github,gitee",
          loginList: "email",
        },
      };
    },
  },
  getters: {},
  // persist: {
  //   enabled: true,
  //   strategies: [{ storage: sessionStorage }]
  // }
});

/**
 * 将ArticleInfo对象转换为Article对象
 * @param articleInfo 文章信息
 */
const articleInfoToArticle = (articleInfo) => {
  let article = articleInfo;
  delete article.likeCount;
  delete article.viewCount;
  delete article.articleType;
  delete article.lastArticle;
  delete article.nextArticle;
  delete article.updateTime;
  return article;
};

export default useLocalStore;
