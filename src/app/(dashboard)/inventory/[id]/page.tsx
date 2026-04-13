export default function InventoryDetailPage({ params }: { params: { id: string } }) {
  return <div>Inventory Item: {params.id}</div>;
}
