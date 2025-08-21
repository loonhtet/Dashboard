import { BlogDropzone } from "../ui/BlogDropzone";

const NewBlog = () => {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">New Blog</h1>
      <BlogDropzone />
    </>
  );
};

export default NewBlog;
