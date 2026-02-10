interface LocalContentProps {
  localText: string;
  landmarks?: string[];
  district?: string;
}

export function LocalContent({ localText, landmarks, district }: LocalContentProps) {
  return (
    <section className="py-16 bg-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Особенности клининга {district ? `в ${district} районе` : 'в Алматы'}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {localText}
            </p>
            {landmarks && landmarks.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-xl">📍</span> Часто работаем рядом с:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {landmarks.map((item, i) => (
                    <span key={i} className="bg-white border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-12 text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">🏆</div>
                <div className="text-2xl font-bold mb-2">№1 по отзывам</div>
                <div className="text-emerald-100 italic">в этом районе Алматы</div>
              </div>
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
