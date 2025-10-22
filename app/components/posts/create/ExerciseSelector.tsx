'use client'

import { useState, useEffect, useCallback, memo } from "react";
import { exercisesAPI } from "@/lib/exercises";
import { Input } from "@/components/ui/input";
import ExerciseButton from "./ExerciseButton";

interface Exercise {
  id: string;
  name: string;
  muscles?: string[];
  group?: string;
}

interface ExerciseSelectorProps {
  selectedExercises: string[];
  onToggleExercise: (exerciseId: string, exerciseName: string) => void;
  getExerciseName: (exerciseId: string) => string;
}

function ExerciseSelector({ 
  selectedExercises, 
  onToggleExercise, 
  getExerciseName 
}: ExerciseSelectorProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [exerciseError, setExerciseError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchExercises = useCallback(async (query = "") => {
    setLoadingExercises(true);
    setExerciseError("");

    try {
      const data = await exercisesAPI.getExercises({
        q: query,
        limit: 20
      });
      setExercises(data.items || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setExerciseError("Error al cargar ejercicios");
      setExercises([]);
    } finally {
      setLoadingExercises(false);
    }
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2 || searchQuery.length === 0) {
        fetchExercises(searchQuery);
      }
    }, searchQuery === "" ? 0 : 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchExercises]);

  return (
    <div className="space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
      <div className="space-y-2">
        <label className="text-muted-foreground text-sm font-medium flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2M5 13l-2-2 2-2" />
          </svg>
          Agregar ejercicios:
        </label>
        
        <div className="relative">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar ejercicios..."
            className="pl-9 text-primary"
          />
          <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {exerciseError && (
        <div className="text-red-400 text-sm text-center py-2">
          {exerciseError}
        </div>
      )}

      {loadingExercises ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <svg className="w-6 h-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-400 text-sm">Cargando ejercicios...</span>
          </div>
        </div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No se encontraron ejercicios</p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-primary text-xs mt-2 hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto 
                     scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pb-6">
          {exercises.map((exercise) => (
            <ExerciseButton
              key={exercise.id}
              exercise={exercise}
              isSelected={selectedExercises.includes(exercise.id)}
              onClick={() => onToggleExercise(exercise.id, exercise.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(ExerciseSelector);