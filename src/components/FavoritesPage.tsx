import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { toggleFavorite } from "../store/favoritesSlice";
import * as Icons from "react-feather";

export function FavoritesPage() {
  const favorites = useAppSelector((state) => state.favorites.items);
  const dispatch = useAppDispatch();

  const handleRemoveFavorite = (exerciseName: string) => {
    const exercise = favorites.find((ex) => ex.name === exerciseName);
    if (exercise) {
      dispatch(toggleFavorite(exercise));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "cardio":
        return <Icons.Activity className="w-5 h-5" />;
      case "strength":
        return <Icons.Target className="w-5 h-5" />;
      default:
        return <Icons.Circle className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-blue-600">Favorite Exercises</h1>
        <p className="text-gray-600">Your saved workout routines</p>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <Icons.Heart className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start adding exercises to your favorites to access them quickly
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Icons.Search className="w-4 h-4 mr-2" />
                Browse Exercises
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icons.Heart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Favorites</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {favorites.length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Icons.Activity className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Cardio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {favorites.filter((ex) => ex.type === "cardio").length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Icons.Target className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Strength</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {favorites.filter((ex) => ex.type === "strength").length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Favorites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((exercise) => (
              <Card
                key={exercise.name}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          exercise.type === "cardio"
                            ? "bg-green-100"
                            : "bg-orange-100"
                        }`}
                      >
                        {getTypeIcon(exercise.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {exercise.name}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {exercise.muscle}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFavorite(exercise.name)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remove from favorites"
                    >
                      <Icons.Heart className="w-6 h-6 fill-current" />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                    {exercise.equipment && (
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200 capitalize">
                        <Icons.Package className="w-3 h-3 mr-1" />
                        {exercise.equipment.replace("_", " ")}
                      </Badge>
                    )}
                  </div>

                  {/* Instructions */}
                  {exercise.instructions && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {exercise.instructions}
                    </p>
                  )}
                  {exercise.description && !exercise.instructions && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {exercise.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Icons.Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Icons.Info className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
