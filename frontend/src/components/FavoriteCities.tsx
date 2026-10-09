import {tableFeatures,useTable,type ColumnDef,} from "@tanstack/react-table";
import type { FavoriteCity } from "../types/city";
import { convertTemperature } from "../utils/temperature";

const features = tableFeatures({});

interface FavoriteCitiesProps {
  cities: FavoriteCity[];
  unit: "C" | "F";
  onDeleteFavorite: (id: string) => void;
  onSelectCity: (city: string) => void;
  onEditFavorite: (city: FavoriteCity) => void;
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

function FavoriteCities({
  cities,
  unit,
  onDeleteFavorite,
  onSelectCity,
  onEditFavorite,
  search,
  onSearchChange,
  page,
  totalPages,
  totalCount,
  onPageChange,
  isLoading,
}: FavoriteCitiesProps) {
  const columns: Array<ColumnDef<typeof features, FavoriteCity>> = [
    {
      accessorKey: "name",
      header: "City",
      cell: (info) => (
        <button
          type="button"
          onClick={() => onSelectCity(info.row.original.name)}
          className="favorite-city-button"
        >
          {info.row.original.name}
        </button>
      ),
    },
    {
      id: "temperature",
      header: "Temperature",
      cell: (info) =>
        `${convertTemperature(info.row.original.temperature, unit)}°${unit}`,
    },
    {
      accessorKey: "nickname",
      header: "Nickname",
      cell: (info) => info.row.original.nickname || "—",
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: (info) => info.row.original.notes || "—",
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="favorite-grid-actions">
          <button
            type="button"
            onClick={() => onEditFavorite(info.row.original)}
            className="edit-button"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDeleteFavorite(info.row.original.id)}
            className="delete-button"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const table = useTable({
    features,
    columns,
    data: cities,
  });

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="favorite-cities">
      <h2 className="favorite-title">Cities</h2>

      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search favorites"
        className="favorite-search"
      />

      <div className="favorite-grid-wrap">
        <table className="favorite-grid">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length}>Loading favorites...</td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>No cities added yet.</td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="favorite-pagination">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="page-button"
        >
          Previous
        </button>

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={
              pageNumber === page ? "page-button active" : "page-button"
            }
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={totalPages === 0 || page >= totalPages}
          className="page-button"
        >
          Next
        </button>

        <span className="page-count">{totalCount} cities</span>
      </div>
    </div>
  );
}

export default FavoriteCities;