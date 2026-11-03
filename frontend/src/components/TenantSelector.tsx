import { useWeatherStore } from "../store/weatherStore";
import type { TenantId } from "../store/weatherStore";

interface TenantSelectorProps {
  onTenantChange: (tenantId: TenantId) => void;
}

function TenantSelector({
  onTenantChange,
}: TenantSelectorProps) {
  const currentTenant = useWeatherStore(
    (state) => state.currentTenant
  );

  return (
    <div className="tenant-selector">
      <label htmlFor="tenant-select">
        Organization:
      </label>

      <select
        id="tenant-select"
        value={currentTenant}
        onChange={(event) =>
          onTenantChange(event.target.value as TenantId)
        }
      >
        <option value="tenant-alpha">
          Alpha Logistics
        </option>

        <option value="tenant-beta">
          Beta Air &amp; Travel
        </option>
      </select>
    </div>
  );
}

export default TenantSelector;