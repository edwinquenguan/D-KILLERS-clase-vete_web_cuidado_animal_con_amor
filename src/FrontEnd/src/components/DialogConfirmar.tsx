interface Props {
  titulo: string;
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  peligroso?: boolean;
}

export default function DialogConfirmar({ titulo, mensaje, onConfirmar, onCancelar, peligroso = true }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
          peligroso ? 'bg-red-100' : 'bg-amber-100'
        }`}>
          {peligroso ? '⚠️' : '❓'}
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-800">{titulo}</h3>
        <p className="mb-6 text-sm text-slate-500">{mensaje}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold text-white transition-colors ${
              peligroso
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
