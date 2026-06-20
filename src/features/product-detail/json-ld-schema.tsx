interface Props {
  schema: any | null | undefined;
}

const ProductJsonLd = ({ schema }: Props) => {
  if (!schema) return null;

  const jsonString = typeof schema === "string" ? schema : JSON.stringify(schema);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
};

export default ProductJsonLd;