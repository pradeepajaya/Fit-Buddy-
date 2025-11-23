import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, Apple, Moon, Brain, Salad, Coffee, Fish, Carrot } from 'lucide-react';

interface WellnessTip {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
}

interface DietSuggestion {
  id: string;
  meal: string;
  name: string;
  description: string;
  calories: number;
  benefits: string[];
  icon: any;
}

const wellnessTips: WellnessTip[] = [
  {
    id: '1',
    title: 'Prioritize Sleep',
    description: 'Aim for 7-9 hours of quality sleep each night. Good sleep is essential for muscle recovery, mental clarity, and overall health. Create a bedtime routine and stick to it.',
    category: 'Sleep',
    icon: Moon,
  },
  {
    id: '2',
    title: 'Practice Mindfulness',
    description: 'Take 10 minutes daily for meditation or deep breathing. This reduces stress, improves focus, and enhances emotional well-being. Start with guided meditation apps if you\'re new.',
    category: 'Mental Health',
    icon: Brain,
  },
  {
    id: '3',
    title: 'Stay Consistent',
    description: 'Consistency beats intensity. Regular moderate exercise is better than sporadic intense workouts. Build sustainable habits that fit your lifestyle.',
    category: 'Exercise',
    icon: Heart,
  },
  {
    id: '4',
    title: 'Eat Mindfully',
    description: 'Slow down and enjoy your meals. Chew thoroughly and avoid distractions while eating. This improves digestion and helps you recognize when you\'re full.',
    category: 'Nutrition',
    icon: Apple,
  },
];

const dietSuggestions: DietSuggestion[] = [
  {
    id: '1',
    meal: 'Breakfast',
    name: 'Protein-Packed Smoothie Bowl',
    description: 'Blend Greek yogurt, banana, berries, spinach, and protein powder. Top with granola, nuts, and fresh fruits.',
    calories: 350,
    benefits: ['High in protein', 'Rich in antioxidants', 'Provides sustained energy'],
    icon: Coffee,
  },
  {
    id: '2',
    meal: 'Lunch',
    name: 'Grilled Chicken Salad',
    description: 'Mixed greens, grilled chicken breast, cherry tomatoes, cucumbers, avocado, and olive oil dressing.',
    calories: 420,
    benefits: ['Lean protein', 'Healthy fats', 'Fiber-rich vegetables'],
    icon: Salad,
  },
  {
    id: '3',
    meal: 'Dinner',
    name: 'Baked Salmon with Quinoa',
    description: 'Herb-crusted salmon with quinoa, roasted vegetables, and a side of steamed broccoli.',
    calories: 480,
    benefits: ['Omega-3 fatty acids', 'Complete protein', 'Complex carbohydrates'],
    icon: Fish,
  },
  {
    id: '4',
    meal: 'Snack',
    name: 'Veggie Sticks with Hummus',
    description: 'Carrot, celery, and bell pepper sticks with homemade or store-bought hummus.',
    calories: 150,
    benefits: ['Low calorie', 'High fiber', 'Plant-based protein'],
    icon: Carrot,
  },
];

export function WellnessPage() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Sleep':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Mental Health':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Exercise':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Nutrition':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMealColor = (meal: string) => {
    switch (meal) {
      case 'Breakfast':
        return 'from-yellow-500 to-orange-500';
      case 'Lunch':
        return 'from-green-500 to-emerald-500';
      case 'Dinner':
        return 'from-blue-500 to-indigo-500';
      case 'Snack':
        return 'from-pink-500 to-rose-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-blue-600">Wellness & Nutrition</h1>
        <p className="text-gray-600">Personalized tips for a healthier you</p>
      </div>

      {/* Personalized Wellness Tips */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-6 h-6 text-pink-500" />
          <h2 className="text-gray-900">Your Wellness Tips</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wellnessTips.map((tip) => {
            const Icon = tip.icon;
            return (
              <Card key={tip.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-gray-900">{tip.title}</h3>
                    </div>
                    <Badge className={getCategoryColor(tip.category)}>
                      {tip.category}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{tip.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Diet Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Apple className="w-6 h-6 text-green-500" />
          <h2 className="text-gray-900">Personalized Diet Plan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dietSuggestions.map((diet) => {
            const Icon = diet.icon;
            return (
              <Card key={diet.id} className="overflow-hidden">
                <div className={`bg-gradient-to-r ${getMealColor(diet.meal)} text-white p-4`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white/80">{diet.meal}</p>
                      <h3 className="text-white">{diet.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-gray-600">{diet.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      {diet.calories} calories
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2">Benefits:</p>
                    <ul className="space-y-1">
                      {diet.benefits.map((benefit, index) => (
                        <li key={index} className="text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Daily Nutrition Goals */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <h3 className="text-gray-900 mb-4">Daily Nutrition Goals</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-gray-600 mb-1">Calories</p>
            <p className="text-green-600">2000</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-1">Protein</p>
            <p className="text-blue-600">150g</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-1">Carbs</p>
            <p className="text-orange-600">250g</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-1">Fats</p>
            <p className="text-purple-600">65g</p>
          </div>
        </div>
      </Card>

      {/* General Tips */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <h3 className="text-gray-900 mb-3">Quick Wellness Reminders</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Drink water regularly throughout the day</li>
          <li>• Include a variety of colorful fruits and vegetables in your diet</li>
          <li>• Limit processed foods and added sugars</li>
          <li>• Listen to your body and eat when hungry</li>
          <li>• Make time for activities you enjoy and that reduce stress</li>
          <li>• Connect with friends and family for emotional well-being</li>
        </ul>
      </Card>
    </div>
  );
}
