import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function StatTiles({
  tiles,
}: {
  tiles: { label: string; value: string; hint?: string }[]
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => (
        <Card key={tile.label}>
          <CardHeader>
            <CardDescription>{tile.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {tile.value}
            </CardTitle>
            {tile.hint ? (
              <p className="text-xs text-muted-foreground">{tile.hint}</p>
            ) : null}
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
