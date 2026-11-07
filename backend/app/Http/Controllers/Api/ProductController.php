<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Store;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request, string $storeId)
    {
        $store = $this->findOwnedStore($request, $storeId);

        return response()->json([
            'data' => $store->products()
                ->with('category')
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    public function store(Request $request, string $storeId)
    {
        $store = $this->findOwnedStore($request, $storeId);

        $data = $request->validate([
            'category_id' => 'nullable|uuid',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_idr' => 'required|integer|min:0',
            'is_available' => 'boolean',
            'sort_order' => 'integer',
            'image' => 'nullable|image|max:2048',
        ]);

        $this->validateCategory(
            $data['category_id'] ?? null,
            $store->id
        );

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')
                ->store('products', 'public');
        }

        unset($data['image']);

        $product = $store->products()->create($data);

        return response()->json([
            'message' => 'Produk berhasil dibuat',
            'data' => $product->load('category'),
        ], 201);
    }

    public function show(Request $request, string $id)
    {
        $product = $this->findOwnedProduct($request, $id);

        return response()->json([
            'data' => $product->load('category'),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $product = $this->findOwnedProduct($request, $id);

        $data = $request->validate([
            'category_id' => 'sometimes|nullable|uuid',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price_idr' => 'sometimes|required|integer|min:0',
            'is_available' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
            'image' => 'nullable|image|max:2048',
        ]);

        if (array_key_exists('category_id', $data)) {
            $this->validateCategory(
                $data['category_id'],
                $product->store_id
            );
        }

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }

            $data['image_path'] = $request->file('image')
                ->store('products', 'public');
        }

        unset($data['image']);

        $product->update($data);

        return response()->json([
            'message' => 'Produk berhasil diperbarui',
            'data' => $product->load('category'),
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $product = $this->findOwnedProduct($request, $id);

        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus',
        ]);
    }

    private function findOwnedStore(Request $request, string $id)
    {
        return Store::where('owner_id', $request->user()->id)
            ->findOrFail($id);
    }

    private function findOwnedProduct(Request $request, string $id)
    {
        return Product::whereHas('store', function ($query) use ($request) {
            $query->where('owner_id', $request->user()->id);
        })->findOrFail($id);
    }

    private function validateCategory(?string $categoryId, string $storeId)
    {
        if (!$categoryId) {
            return;
        }

        $exists = Category::where('id', $categoryId)
            ->where('store_id', $storeId)
            ->exists();

        if (!$exists) {
            abort(422, 'Kategori tidak sesuai dengan toko.');
        }
    }
}