function crossProduct(a, b) {
    return a.x * b.y - a.y * b.x;
}

function getItem(list, index) {
    const length = list.length;
    return list[(index + length) % length];
}


function triangulate(vertices) {
    const triangles = [];
    let errorMessage = '';

    // Check if the input vertices are valid
    if (!vertices) {
        errorMessage = 'The vertex list is null.';
        return { success: false, triangles, errorMessage };
    }

    if (vertices.length < 3) {
        errorMessage = 'The vertex list must have at least 3 vertices.';
        return { success: false, triangles, errorMessage };
    }

    if (vertices.length > 1024) {
        errorMessage = 'The max vertex list length is 1024.';
        return { success: false, triangles, errorMessage };
    }

    console.log("vertices length:");
    console.log(vertices.length);

    const indexList = [];
    for (let i = 0; i < vertices.length; i++) {
        indexList.push(i);
    }

    console.log('indexList: ', indexList);

    const totalTriangleCount = vertices.length - 2;
    const totalTriangleIndexCount = totalTriangleCount * 3;
    let triangleIndexCount = 0;

    // Ear-clipping algorithm to find triangles
    while (indexList.length > 3) {
        let earFound = false;

        for (let i = 0; i < indexList.length; i++) {
            const a = indexList[i];
            const b = getItem(indexList, i - 1);
            const c = getItem(indexList, i + 1);

            console.log('checking: ', b, a, c);

            const va = vertices[a];
            const vb = vertices[b];
            const vc = vertices[c];

            const va_to_vb = subtractVectors(vb, va);
            const va_to_vc = subtractVectors(vc, va);

            if (crossProduct(va_to_vb, va_to_vc) < 0) {
                console.log('Not a convex vertex, skip it');
                continue; // Not a convex vertex, skip it
            }

            let isEar = true;

            // Check if any other vertex lies inside the triangle
            for (let j = 0; j < vertices.length; j++) {
                if (j === a || j === b || j === c) continue;

                const p = vertices[j];
                console.log('is P inside triangle => ', p);
                if (isPointInTriangle(p, va, vb, vc)) {
                    isEar = false;
                    console.log('yes it is inside triangle => ', p);
                    break;
                }
            }

            if (isEar) {
                // Add the triangle indices to the list
                console.log(b, a, c, ' is triangle');
                triangles.push(b, a, c);
                indexList.splice(i, 1); // Remove the ear vertex
                earFound = true;
                break;
            }
        }

        if (!earFound) {
            errorMessage = 'Failed to find an ear to clip.';
            return { success: false, triangles, errorMessage };
        }
    }

    // Add the final triangle
    triangles.push(indexList[0], indexList[1], indexList[2]);

    return { success: true, triangles, errorMessage };
}

function isPointInTriangle(p, a, b, c) {
    const ab = subtractVectors(b, a);
    const bc = subtractVectors(c, b);
    const ca = subtractVectors(a, c);

    const ap = subtractVectors(p, a);
    const bp = subtractVectors(p, b);
    const cp = subtractVectors(p, c);

    const cross1 = crossProduct(ab, ap);
    const cross2 = crossProduct(bc, bp);
    const cross3 = crossProduct(ca, cp);

    if (cross1 < 0 || cross2 < 0 || cross3 < 0) {
        return false;
    }
    return true;
}

function subtractVectors(v1, v2) {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
}

function isSimplePolygon(vertices) {
    throw new Error('NotImplementedException');
}