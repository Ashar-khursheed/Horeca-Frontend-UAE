interface Props {
  schema: string | null | undefined;
}

const ProductJsonLd = ({ schema }: Props) => {
  if (!schema) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schema }}
    />
  );
};

export default ProductJsonLd;
