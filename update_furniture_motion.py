import os
import re

file_path = 'src/components/FurnitureStoreSection.tsx'
with open(file_path, 'r') as f:
    content = f.read()

if 'import { motion }' not in content:
    content = content.replace('import React, { useState, useMemo } from "react";', 'import React, { useState, useMemo } from "react";\nimport { motion } from "motion/react";')

# Header motion
content = re.sub(
    r'<div className="mb-12">\n\s*<div className="flex items-center gap-2 mb-4">',
    r'<motion.div \n          initial={{ opacity: 0, y: 20 }}\n          whileInView={{ opacity: 1, y: 0 }}\n          viewport={{ once: true }}\n          transition={{ duration: 0.6 }}\n          className="mb-12"\n        >\n          <div className="flex items-center gap-2 mb-4">',
    content
)
content = content.replace(
    '            </p>\n          </div>\n        </div>',
    '            </p>\n          </div>\n        </motion.div>'
)

# Card motion
content = re.sub(
    r'\{filteredProducts\.map\(\(product\) => \(',
    r'{filteredProducts.map((product, index) => (',
    content
)
content = re.sub(
    r'<div\n\s*key=\{product.id\}',
    r'<motion.div\n              initial={{ opacity: 0, y: 30 }}\n              whileInView={{ opacity: 1, y: 0 }}\n              viewport={{ once: true, margin: "-50px" }}\n              transition={{ duration: 0.6, delay: index * 0.1 }}\n              key={product.id}',
    content
)
content = content.replace(
    '                </div>\n              </div>\n            </div>\n          ))}',
    '                </div>\n              </div>\n            </motion.div>\n          ))}'
)

with open(file_path, 'w') as f:
    f.write(content)

print("Added motion to Furniture Store")
