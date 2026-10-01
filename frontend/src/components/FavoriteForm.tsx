import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {favoriteSchema,type FavoriteFormData,} from "../schemas/favoriteSchema";
interface FavoriteFormProps {
  mode: "add" | "edit";
  defaultValues: FavoriteFormData;
  onSubmit: (data: FavoriteFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
function FavoriteForm({mode, defaultValues, onSubmit, onCancel, isSubmitting,}: FavoriteFormProps) {
  const {register,handleSubmit,reset,formState: { errors },} = useForm<FavoriteFormData>({
    resolver: zodResolver(favoriteSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="favorite-form">
      <h2>{mode === "add" ? "Add Favorite City" : "Edit Favorite City"}</h2>
      <label>
        City
        <input {...register("city")} />
      </label>
      {errors.city && (
        <p className="error-message">{errors.city.message}</p>
      )}
      <label>
        Nickname
        <input {...register("nickname")} />
      </label>
      {errors.nickname && (
        <p className="error-message">{errors.nickname.message}</p>
      )}
      <label>
        Notes
        <input {...register("notes")} />
      </label>
      {errors.notes && (
        <p className="error-message">{errors.notes.message}</p>
      )}
      <button type="submit" disabled={isSubmitting}>
        {mode === "add" ? "Add" : "Save"}
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
export default FavoriteForm;