import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { b } from "framer-motion/client";

const SunFlower = () => {
  const [name, setName] = useState("");
  const [askName, setAskName] = useState(true);
  const inputRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (askName && inputRef.current) inputRef.current.focus();
  }, [askName]);

  const size = 450;
  const cx = size / 2;
  const cy = size / 2;

  const petals = 9;
  const ringRadius = 70;
  const petalRx = 54;
  const petalRy = 50;

  const petalsData = useMemo(() => {
    return Array.from({ length: petals }, (_, i) => {
      const angleDeg = (360 / petals) * i;
      const a = (Math.PI / 140) * angleDeg;
      const px = cx + ringRadius * Math.cos(a);
      const py = cy + ringRadius * Math.sin(a);
      return { i, angleDeg, px, py };
    });
  }, [petals, cx, cy, ringRadius]);

  const petalVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (index) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
        delay: 0.5 * index,
      },
    }),
  };

  const diskVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 10,
        delay: 0,
      },
    },
  };

  const stemVariants = {
    hidden: { scaleY: 0, opacity: 0, originY: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: { duration: 1.2, delay: 0.5 * petals },
    },
  };

  const leafVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (d) => ({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.2, delay: 0.5 * petals + d },
    }),
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setName(e.currentTarget.username.value.trim());

    setAskName(false);
  };

  const reset = () => {
    setName("");
    setAskName(true);
  };

  const download = () => {
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // ajusta el tamaño del canvas al viewBox
    canvas.width = 1920;
    canvas.height = 1280;

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `girasol_${name || "mi"}_.png`;
      link.href = pngFile;
      link.click();
    };
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  const noTouch = () => {
    alert(`No me toques ${name}, ahora tienes virus muajajaja`);
  };

  return (
    <div className="flex justify-center min-h-screen max-h-screen -bg-linear-270 from-purple-900 via-purple-800 to-purple-900">
      <div className="w-full max-w-3xl rounded-2xl bg-rose-100 flex flex-col">
        {/* Nombre */}
        <div className="block h-2 col-1">
          {name && (
            <motion.g
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5 * petals + 0.5,
                duration: 0.5,
                type: "spring",
                stiffness: 120,
                damping: 1,
              }}
            >
              <text
                style={{
                  color: "#f6b801",
                  textShadow: "1px 2px 2px #000",
                }}
                className="font-bold text-3xl justify-center text-center flex pt-8 ml-2 mr-2"
              >
                Hola, {name} este es tu girasol 🌻
              </text>
            </motion.g>
          )}
        </div>

        <svg ref={svgRef} viewBox={`0 20 ${size} ${size}`}>
          {name && (
            <>
              {/* Tallo */}
              <motion.rect
                x={cx - 6}
                y={cy + 40}
                width={12}
                height={190}
                rx={3}
                variants={stemVariants}
                initial="hidden"
                animate="visible"
                fill="#3b8d20"
                strokeWidth={1.5}
              />

              {/* Hojas */}
              <motion.path
                d={`M ${cx - 6} ${
                  cy + 125
                } q -80 -30 -110 30 q 40 -10 110 -30 z`}
                fill="#4aa43a"
                stroke="#3b8d2e"
                strokeWidth={2}
                variants={leafVariants}
                initial="hidden"
                animate="visible"
                custom={0.4}
              />
              <motion.path
                d={`M ${cx + 6} ${
                  cy + 110
                } q 90 -30 120 35 q -45 -8 -120 -35 z`}
                fill="#4aa43a"
                stroke="#3b8d2e"
                strokeWidth={2}
                variants={leafVariants}
                initial="hidden"
                animate="visible"
                custom={0.6}
              />

              {/* Pétalos */}
              {petalsData.map(({ i, angleDeg, px, py }) => (
                <motion.ellipse
                  key={i}
                  cx={px}
                  cy={py}
                  rx={petalRx}
                  ry={petalRy}
                  transform={`rotate(${angleDeg} ${px} ${py})`}
                  fill="#f6b800"
                  stroke="#d89a00"
                  strokeWidth={2}
                  variants={petalVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                />
              ))}

              {/* Centro */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={40}
                fill="#6b3f14"
                stroke="#4a2b0d"
                strokeWidth={2}
                variants={diskVariants}
                initial="hidden"
                animate="visible"
              />

              {/* Semillas */}
              {Array.from({ length: 10 }).map((_, i) => {
                const angle = (i * 137.5 * Math.PI) / 180;
                const r = Math.sqrt(i) * 4.5;
                const x = cx + r * Math.cos(angle) * 2.2;
                const y = cy + r * Math.sin(angle) * 2.2;
                return (
                  <motion.circle
                    key={_}
                    cx={x}
                    cy={y}
                    r={0.01}
                    fill="#3a220b"
                    opacity={0.01}
                    stroke="#1e0e03"
                    strokeWidth={1}
                    variants={diskVariants}
                    initial="hidden"
                    animate="visible"
                  />
                );
              })}

              <motion.text
                x={cx}
                y={cy + 5}
                textAnchor="middle"
                className={"font-bold text-3xl font-sans"}
                fill={"#3a220f"}
                opacity={0.7}
                stroke={"#000"}
                strokeWidth={0.5}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.5 * petals + 0.5,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 120,
                  damping: 1,
                }}
              >
                {name.substring(0, 1)}
              </motion.text>
            </>
          )}
        </svg>

        {/* Controles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.5 * petals + 2,
            duration: 0.5,
            type: "spring",
            stiffness: 120,
            damping: 1,
          }}
          className="absolute bottom-2 flex gap-2.5 pl-2 text-slate-600"
        >
          <button
            className="px-4 py-2 rounded-xl bg-slate-100"
            onClick={noTouch}
          >
            Pétalos: {petals}
          </button>

          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-yellow-300 hover:bg-yellow-400 text-slate-800 shadow-sm transition"
          >
            Cambiar nombre
          </button>

          <button
            onClick={download}
            className="px-4 py-2 rounded-xl bg-green-300 hover:bg-green-400 text-slate-800 shadow-sm transition"
          >
            Descargar
          </button>
        </motion.div>

        {/* Modal pedir nombre */}
        <AnimatePresence>
          {askName && (
            <motion.div
              className="absolute inset-0 -bg-linear-270 from-purple-900 via-purple-800 to-purple-900  backdrop-blur-sm flex items-center justify-center rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.form
                onSubmit={handleSubmit}
                className="bg-white text-black rounded-2xl shadow-2xl p-6 w-[92%] max-w-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
              >
                <h2 className="text-lg font-semibold text-slate-800 mb-1">
                  ¿Cómo te llamas?
                </h2>
                <p className="text-slate-600 mb-4">
                  Escribe tu nombre para mostrarlo arriba del girasol.
                </p>
                <input
                  ref={inputRef}
                  name="username"
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                  maxLength={20}
                />
                <div className="mt-4 flex gap-2 justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold shadow"
                  >
                    Continuar
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SunFlower;
