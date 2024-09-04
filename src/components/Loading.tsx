export default function Loading() {
  return (
    <>
      <div className="animate-pulse w-full h-20 bg-gray-200 rounded-md" />
      {[...Array(10)].map((e, i) => (
        <div
          key={i}
          className="animate-pulse w-full h-20 bg-gray-200 rounded-md mt-2"
        />
      ))}
    </>
  );
}
