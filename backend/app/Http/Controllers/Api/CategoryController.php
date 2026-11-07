<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Store;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request, string $storeId)
    {
        $store = $this->findOwnedStore($request, $storeId);

        return response()->json([
            'data' => $store->categories()
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    public function store(Request $request, string $storeId)
    {
        $store = $this->findOwnedStore($request, $storeId);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $category = $store->categories()->create($data);

        return response()->json([
            'message' => 'Kategori berhasil dibuat',
            'data' => $category,
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $category = $this->findOwnedCategory($request, $id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $category->update($data);

        return response()->json([
            'message' => 'Kategori berhasil diperbarui',
            'data' => $category,
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $category = $this->findOwnedCategory($request, $id);

        $category->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus',
        ]);
    }

    private function findOwnedStore(Request $request, string $id)
    {
        return Store::where('owner_id', $request->user()->id)
            ->findOrFail($id);
    }

    private function findOwnedCategory(Request $request, string $id)
    {
        return Category::whereHas('store', function ($query) use ($request) {
            $query->where('owner_id', $request->user()->id);
        })->findOrFail($id);
    }
}